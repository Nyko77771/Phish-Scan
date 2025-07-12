/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
var urlDetectionController = function urlDetectionController() {
  var url = window.location.href;
  var emailServiceDetected = false;
  var emailOpenedCheck = false;
  if (url.includes("mail.google.com") || url.includes("outlook.office365.com") || url.includes("mail.yahoo.com") || url.includes("icloud.com/mail/")) {
    emailServiceDetected = true;
    console.log("Service detected");
  }
  if (emailServiceDetected) {
    console.log("Opened Email Service");
    if (url.includes("/mail/u/0//") && url.match(/#inbox\/[a-zA-Z0-9]/)) {
      emailOpenedCheck = true;
      console.log("Gmail: Email opened");
    } else if (url.includes("outlook.office365.com/mail/") && url.match(/\/mail\/inbox\/\/id\/[a-zA-Z0-9]+/)) {
      emailOpenedCheck = true;
      console.log("Outlook: Email opened");
    } else if (url.includes("mail.yahoo.com") && url.includes("/d/message/")) {
      emailOpenedCheck = true;
      console.log("YahooMail: Email opened");
    } else if (url.includes("icloud.com/mail") && url.match(/#.*\/message\/[a-zA-Z0-9]+/)) {
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
};
setTimeout(urlDetectionController, 1000);
/******/ })()
;
//# sourceMappingURL=content.js.map