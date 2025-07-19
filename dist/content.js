/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
// Initial Popup Response Handling
// variable for initial url
var lastUrl = location.href;

// Controller function for detecting url changes
function urlDetectionController() {
  currentUrl = window.location.href;
  if (currentUrl != lastUrl) {
    console.log("URL Changed");
    console.log("Old URL: ".concat(lastUrl));
    console.log("New URL: ".concat(currentUrl));
    lastUrl = currentUrl;
    emailOpenController(currentUrl);
  }
}

// function for detecting email services and if email is opened
function emailOpenController(providedUrl) {
  var url = providedUrl;
  var emailServiceDetected = false;
  var emailOpenedCheck = false;
  if (url.includes("mail.google.com") || url.includes("outlook.office365.com") || url.includes("outlook.live.com") || url.includes("mail.yahoo.com") || url.includes("icloud.com/mail/")) {
    emailServiceDetected = true;
    console.log("Service detected");
  }
  if (emailServiceDetected) {
    console.log("Opened Email Service");
    console.log("Url opened: ".concat(url));
    if (url.includes("mail.google.com/mail/u/0/") && url.match(/#inbox\/[a-zA-Z0-9]+/)) {
      emailOpenedCheck = true;
      console.log("Gmail: Email opened");
      scanPage();
    }
    if ((url.includes("outlook.office365.com/mail/") || url.includes("outlook.live.com/mail/")) && (url.match(/\/mail\/inbox\/id\/[a-zA-Z0-9]+/) || url.match(/\/mail\/[0-9]+\/sentiments\/id\/[a-zA-Z0-9]+/))) {
      emailOpenedCheck = true;
      console.log("Outlook: Email opened");
    }
    if (url.includes("mail.yahoo.com") && url.includes("/d/message/")) {
      emailOpenedCheck = true;
      console.log("YahooMail: Email opened");
    }
    if (url.includes("icloud.com/mail") && url.match(/#.*\/message\/[a-zA-Z0-9]+/)) {
      emailOpenedCheck = true;
      console.log("Apple: Email opened");
    }
  }
  console.log("Is service: ".concat(emailServiceDetected, "\nEmail opened: ").concat(emailOpenedCheck));
  chrome.runtime.sendMessage({
    message: "updateStatus",
    emailServiceDetected: emailServiceDetected,
    emailOpenedCheck: emailOpenedCheck,
    url: url
  });
}

//Function pageStateCheck was created using some advice found on StackOverflow.
//This function tracks the changes in the state of tabs
/***************************************************************************************
 *    Title: How to detect if URL has changed after hash in JavaScript
 *    Author: aljgom
 *    Date: 15/10/2018
 *    Availability: https://stackoverflow.com/questions/6390341/how-to-detect-if-url-has-changed-after-hash-in-javascript
 *
 ***************************************************************************************/

function pageStateCheck() {
  var oldPushState = history.pushState;
  var oldReplaceState = history.replaceState;
  history.pushState = function pushState() {
    oldPushState.apply(this, arguments);
    urlDetectionController();
  };
  history.replaceState = function replaceState() {
    oldReplaceState.apply(this, arguments);
    urlDetectionController();
  };
  window.addEventListener("popstate", urlDetectionController);
}

// calling pageStateCheck
pageStateCheck();

// calling urlDetection after a minute
setTimeout(urlDetectionController, 1000);

// Email Page Scanning
//Using listener for receiving scan request
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "scanPage") {
    console.log("Content: Performing scan");
    // Saving scan page results into results variable
    var results = scanPage();
    console.log("Content: Email scan completed");

    // Saving id from the request into tab ID variable
    var tabId = request.tabId;
    // Sending scan results back to background
    sendResponse({
      tabId: tabId,
      results: results
    });
    return true;
  }
  if (request.action === "highlightPage") {
    //Highlight test
    console.log("Content: Doing Highlight");
    highlightResults();
  }
});

//Function for scanning email contents
function scanPage() {
  console.log("Content: Starting scan");
  //Defining different tags that hold text
  var tags = ["h1", "h2", "h3", "h4", "p", "span ", "div", "a"];

  // Empty lists for storing text and links
  var emailContent = [];
  var emailLinks = [];
  tags.forEach(function (tag) {
    var elements = document.querySelectorAll(tag);
    elements.forEach(function (element) {
      if (element.innerText) {
        var text = element.innerText.trim();
        if (text) {
          emailContent.push(text);
        }
      }
      if (element.tagName.toLowerCase() === "a" && element.href) {
        emailLinks.push({
          link: element.href,
          text: element.innerText.trim()
        });
      }
    });
  });
  console.log("Content: Finished Email Scan");
  return {
    emailText: emailContent,
    emailLinks: emailLinks
  };
}

//Term Highlight
// Function for highlighting the email page
function highlightResults() {
  var terms = ["Cyber security", "SOC"];
  var tags = ["h1", "h2", "h3", "h4", "p", "span", "div", "a"];
  terms.forEach(function (term) {
    tags.forEach(function (tag) {
      var elements = document.querySelectorAll(tag);
      elements.forEach(function (element) {
        if (element.innerHTML.includes(term)) {
          element.innerHTML = element.innerHTML.replaceAll(term, "<span style=\"background-color: yellow\">".concat(term, "</span>"));
        }
      });
    });
  });
}
/******/ })()
;
//# sourceMappingURL=content.js.map