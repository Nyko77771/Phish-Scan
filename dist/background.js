/******/ (() => { // webpackBootstrap
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message received: ".concat(message));
  console.log("Sender is ".concat(sender, "."));
  sendResponse({
    message: "received"
  });
});
/******/ })()
;
//# sourceMappingURL=background.js.map