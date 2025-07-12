/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
var urlDetectionController = function urlDetectionController() {
  var url = window.location.href;
  var emailServiceDetected = false;
  var emailOpenedCheck = false;
  ;
  if (url.includes("mail.google.com") || url.includes("outlook.office365.com") || url.includes("mail.yahoo.com") || url.includes("icloud.com/mail/")) {
    emailServiceDetected = true;
    console.log("Service detected");
  }
  if (url.includes("/mail/inbox/id/") || url.includes("/mail/u/0/") || url.includes("messageId") || url.includes("#inbox")) {
    emailOpenedCheck = true;
    console.log("Email opened");
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