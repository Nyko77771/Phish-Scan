/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
var lastUrl = location.href;
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

  /*
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
    history.pushState = function (...args) {
    originalPushState.apply(this, args);
    urlDetectionController();
  };
    history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    urlDetectionController();
  };
    window.addEventListener("popstate", urlDetectionController);
    */
}
pageStateCheck();
setTimeout(urlDetectionController, 1000);
/******/ })()
;
//# sourceMappingURL=content.js.map