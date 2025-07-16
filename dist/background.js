/******/ (() => { // webpackBootstrap
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var tab = new Map();
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "updateStatus" && sender.tab) {
    var tabId = sender.tab.id.toString();
    chrome.storage.local.set(_defineProperty({}, tabId, {
      emailServiceDetected: request.emailServiceDetected,
      emailOpenCheck: request.emailOpenedCheck,
      url: request.url
    }));
  }
  if (request.message === "tabStatus") {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      var defaultResponse = {
        emailServiceDetected: false,
        emailOpenedCheck: false
      };
      if (tabs.length === 0) {
        console.log("No tabs open");
        sendResponse(defaultResponse);
        return;
      }
      var tabId = tabs[0].id.toString();
      chrome.storage.local.get(tabId, function (result) {
        var tabData = result[tabId] || defaultResponse;
        sendResponse(tabData);
      });
    });
    return true;
  }
});
/******/ })()
;
//# sourceMappingURL=background.js.map