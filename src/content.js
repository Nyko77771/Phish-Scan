// Initial Popup Response Handling
// variable for initial url
let lastUrl = location.href;

// Controller function for detecting url changes
function urlDetectionController() {
  //Getting the current URL
  currentUrl = window.location.href;

  //Checking if current is different from last URL's
  if (currentUrl != lastUrl) {
    console.log(`Content: URL Changed`);
    console.log(`Content: Old URL: ${lastUrl}`);
    console.log(`Content: New URL: ${currentUrl}`);
    //Setting last URL to be the new/current URL
    lastUrl = currentUrl;
    //Calling on emailOpenController to check Service and Email
    emailOpenController(currentUrl);
  }
}

// function for detecting email services and if email is opened
function emailOpenController(providedUrl) {
  const url = providedUrl;

  //Defining Service and Email variables
  let emailServiceDetected = false;
  let emailOpenedCheck = false;

  //Temporal Solution
  //Checking for Big Email service
  if (
    url.includes("mail.google.com")
    /*
    #########################
    Need to implement later
    #########################
    ||
    url.includes("outlook.office365.com") ||
    url.includes("outlook.live.com") ||
    url.includes("mail.yahoo.com") ||
    url.includes("icloud.com/mail/")
    */
  ) {
    //If Present then make service found true
    emailServiceDetected = true;
    console.log(`Content: Service detected`);
  }

  //If Service is detected then check if email is opened
  if (emailServiceDetected) {
    console.log("Content: Opened Email Service");

    const regexGmail =
      /https:\/\/mail\.google\.com\/mail\/u\/\d+\/?.*#inbox\/[a-zA-Z0-9]+/;
    //Checking for Gmail
    if (url.includes("mail.google.com/mail/u/") && regexGmail.test(url)) {
      emailOpenedCheck = true;
      console.log(`Gmail: Email opened`);
    }
    //Checking for Outlook
    /*
    ###############################
    Need to be fix below services
    [Outlook, Yahoo, Apple]
    ###############################
    */
    /*
    if (
      (url.includes("outlook.office365.com/mail/") ||
        url.includes("outlook.live.com/mail/")) &&
      (url.match(/\/mail\/inbox\/id\/[a-zA-Z0-9]+/) ||
        url.match(/\/mail\/[0-9]+\/sentiments\/id\/[a-zA-Z0-9]+/))
    ) {
      emailOpenedCheck = true;
      console.log(`Outlook: Email opened`);
    }
    // Checking for Yahoo
    if (url.includes("mail.yahoo.com") && url.includes("/d/message/")) {
      emailOpenedCheck = true;
      console.log(`YahooMail: Email opened`);
    }
    // Checking Icloud
    if (
      url.includes("icloud.com/mail") &&
      url.match(/#.*\/message\/[a-zA-Z0-9]+/)
    ) {
      emailOpenedCheck = true;
      console.log(`Apple: Email opened`);
    }
      */
  }

  console.log(
    `Is service: ${emailServiceDetected}\nEmail opened: ${emailOpenedCheck}`
  );

  //Sending results of checks to background
  chrome.runtime.sendMessage({
    message: "updateStatus",
    emailServiceDetected,
    emailOpenedCheck,
    url,
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
  // Creating variables for old state and its replacement
  let oldPushState = history.pushState;
  let oldReplaceState = history.replaceState;

  //function for overriding the pushState
  history.pushState = function pushState() {
    oldPushState.apply(this, arguments);
    //After change the urlDetectionController function is called
    urlDetectionController();
  };

  //function for overriding the current state that replaced the previous one
  history.replaceState = function replaceState() {
    oldReplaceState.apply(this, arguments);
    urlDetectionController();
  };

  //adding event listener to the window for when history changes
  //triggers urlDetectionController function
  window.addEventListener("popstate", urlDetectionController);
}

// calling pageStateCheck
pageStateCheck();

// calling urlDetection after a minute
setTimeout(urlDetectionController, 1000);

// Email Page Scanning
//Using listener for receiving scan request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanPage") {
    console.log("Content: Performing scan");
    // Saving scan page results into results variable
    const results = scanPage();
    console.log("Content: Email scan completed");

    // Saving id from the request into tab ID variable
    const tabId = request.tabId;
    // Sending scan results back to background
    sendResponse({ tabId: tabId, results: results });

    return true;
  }

  if (request.action === "highlightPage") {
    console.log("Content: Doing Highlight");
    const toHighlight = request.words;
    const outcome = highlightResults(toHighlight);
    if (outcome) {
      sendResponse(outcome);
    }
    return true;
  }
});

//Function for scanning email contents
function scanPage() {
  console.log(`Content: Starting scan`);

  const emailContainer = document.querySelector(".a3s");

  if (!emailContainer) {
    console.log(`Content: No email body found`);
    return {
      emailText: [],
      emailLinks: [],
    };
  }

  //Defining different tags that hold text
  const tags = ["h1", "h2", "h3", "h4", "p", "span ", "div", "a"];

  // Empty lists for storing text and links
  var emailContent = [];
  var emailLinks = [];

  //Looping through each tag
  tags.forEach((tag) => {
    //Getting elements based on tag
    const elements = emailContainer.querySelectorAll(tag);
    // Looping through each element found
    elements.forEach((element) => {
      //Seeing if there is text inside the element
      if (element.innerText) {
        const text = element.innerText.trim();
        //If there are are words then push them into emailContent list
        if (text) {
          emailContent.push(text);
        }
      }

      if (element.tagName.toLowerCase() === "a" && element.href) {
        emailLinks.push({ link: element.href, text: element.innerText.trim() });
      }
    });
  });

  console.log(`Content: Finished Email Scan`);

  return {
    emailText: emailContent,
    emailLinks: emailLinks,
  };
}

//Term Highlight
// Function for highlighting the email page
function highlightResults(words) {
  //console.log(`These are words that need to be highlighted: ${words}`);
  const terms = words;

  if (terms.length === 0) {
    alert(`Nothing to highlight!`);
    return false;
  }

  const emailContainer = document.querySelector(".a3s");

  if (!emailContainer) {
    console.log(`Content: No email body found`);
    return false;
  }

  const tags = ["h1", "h2", "h3", "h4", "p", "span", "div", "a"];
  console.log(`Content: starting highlight`);

  try {
    terms.forEach((term) => {
      tags.forEach((tag) => {
        const elements = emailContainer.querySelectorAll(tag);
        elements.forEach((element) => {
          if (element.innerHTML.toLowerCase().includes(term.toLowerCase())) {
            const regularExpression = new RegExp(`\\b${term}\\b`, "gi");
            element.innerHTML = element.innerHTML.replaceAll(
              regularExpression,
              `<span style="background-color: yellow">${term}</span>`
            );
          }
        });
      });
    });
    console.log(`Content: highlight is finished`);
    return true;
  } catch (error) {
    console.log(`Content: Failed to highlight found terms. Error: ${error}`);
    return false;
  }
}
