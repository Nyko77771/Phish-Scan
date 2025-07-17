// Initial Popup Response Handling
let lastUrl = location.href;

function urlDetectionController() {
  currentUrl = window.location.href;

  if (currentUrl != lastUrl) {
    console.log(`URL Changed`);
    console.log(`Old URL: ${lastUrl}`);
    console.log(`New URL: ${currentUrl}`);
    lastUrl = currentUrl;
    emailOpenController(currentUrl);
  }
}

function emailOpenController(providedUrl) {
  const url = providedUrl;

  let emailServiceDetected = false;
  let emailOpenedCheck = false;

  if (
    url.includes("mail.google.com") ||
    url.includes("outlook.office365.com") ||
    url.includes("outlook.live.com") ||
    url.includes("mail.yahoo.com") ||
    url.includes("icloud.com/mail/")
  ) {
    emailServiceDetected = true;
    console.log(`Service detected`);
  }

  if (emailServiceDetected) {
    console.log("Opened Email Service");
    console.log(`Url opened: ${url}`);

    if (
      url.includes("mail.google.com/mail/u/0/") &&
      url.match(/#inbox\/[a-zA-Z0-9]+/)
    ) {
      emailOpenedCheck = true;
      console.log(`Gmail: Email opened`);
      scanPage();
    }
    if (
      (url.includes("outlook.office365.com/mail/") ||
        url.includes("outlook.live.com/mail/")) &&
      (url.match(/\/mail\/inbox\/id\/[a-zA-Z0-9]+/) ||
        url.match(/\/mail\/[0-9]+\/sentiments\/id\/[a-zA-Z0-9]+/))
    ) {
      emailOpenedCheck = true;
      console.log(`Outlook: Email opened`);
    }
    if (url.includes("mail.yahoo.com") && url.includes("/d/message/")) {
      emailOpenedCheck = true;
      console.log(`YahooMail: Email opened`);
    }
    if (
      url.includes("icloud.com/mail") &&
      url.match(/#.*\/message\/[a-zA-Z0-9]+/)
    ) {
      emailOpenedCheck = true;
      console.log(`Apple: Email opened`);
    }
  }

  console.log(
    `Is service: ${emailServiceDetected}\nEmail opened: ${emailOpenedCheck}`
  );

  chrome.runtime.sendMessage({
    message: "updateStatus",
    emailServiceDetected,
    emailOpenedCheck,
    url,
  });
}

function pageStateCheck() {
  let oldPushState = history.pushState;
  let oldReplaceState = history.replaceState;

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

pageStateCheck();

setTimeout(urlDetectionController, 1000);

// Email Page Scanning

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanPage") {
    console.log("Content: Performing scan");
    const results = scanPage();
    console.log("Content: Email scan completed");

    const tabId = request.tabId;
    sendResponse({ tabId: tabId, results: results });

    return true;
  }

  if (request.action === "highlightPage") {
    //Highlight test
    console.log("Content: Doing Highlight");
    highlightResults();
  }
});

function scanPage() {
  console.log(`Content: Starting scan`);
  const tags = ["h1", "h2", "h3", "h4", "p", "span ", "div", "a"];

  var emailContent = [];
  var emailLinks = [];

  tags.forEach((tag) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((element) => {
      if (element.innerText) {
        const text = element.innerText.trim();
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

function highlightResults() {
  const terms = ["Cyber security", "SOC"];
  const tags = ["h1", "h2", "h3", "h4", "p", "span", "div", "a"];

  terms.forEach((term) => {
    tags.forEach((tag) => {
      const elements = document.querySelectorAll(tag);
      elements.forEach((element) => {
        if (element.innerHTML.includes(term)) {
          element.innerHTML = element.innerHTML.replaceAll(
            term,
            `<span style="background-color: yellow">${term}</span>`
          );
        }
      });
    });
  });
}
