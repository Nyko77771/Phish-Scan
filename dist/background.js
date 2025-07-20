/******/ (() => { // webpackBootstrap
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
//Creting a tab object for storing a pair of values
var tab = new Map();

//chrome Listener for incoming messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handling the status update request
  if (request.message === "updateStatus" && sender.tab) {
    var tabId = sender.tab.id.toString();
    // Setting the storage of the local opened tab
    chrome.storage.local.set(_defineProperty({}, tabId, {
      emailServiceDetected: request.emailServiceDetected,
      emailOpenCheck: request.emailOpenedCheck,
      url: request.url
    }));
  }
  // Handling the sending of local tab data
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

  // Handling the email scan request
  if (request.action === "startScan") {
    console.log("Background: Received Scan Request");
    var id = request.tabId;
    console.log("Background: Tab ID: ".concat(id));

    //Checking if the request contains an id
    if (!id) {
      console.log("Background: No id found");
      return;
    }

    //Sending a message to content.js
    chrome.tabs.sendMessage(id, {
      action: "scanPage",
      tabId: id
    }, /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(contentResponse) {
        var jsonRules, results, _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (contentResponse) {
                _context2.n = 1;
                break;
              }
              sendResponse({
                error: "No response from content.js"
              });
              return _context2.a(2);
            case 1:
              _context2.p = 1;
              _context2.n = 2;
              return fetch(chrome.runtime.getURL("phishing_rules.json")).then(function (response) {
                console.log("Background: Obtaining JSON format");
                return response.json();
              }).then(function (data) {
                console.log("Background: Obtaining Fishing Data Rules");
                return data.phishing_detection_rules;
              });
            case 2:
              jsonRules = _context2.v;
              // Performing the check of the scan
              results = checkScan(jsonRules, contentResponse); //Sending another for highlighting words
              chrome.tabs.sendMessage(id, {
                action: "highlightPage",
                words: results.toHighlight,
                tabId: id
              }, /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(contentResponse2) {
                  return _regenerator().w(function (_context) {
                    while (1) switch (_context.n) {
                      case 0:
                        //Checking for response presence and for false value
                        if (!contentResponse2 || contentResponse2 === false) {
                          console.log("Background: Highlight failed");
                          //Sending response if false or no response from content.js
                          sendResponse({
                            completed: false
                          });
                        }

                        //Sending Response if true
                        console.log("Background: Highlighted Response Received");
                        sendResponse({
                          completed: true,
                          rules: results.rules
                        });
                      case 1:
                        return _context.a(2);
                    }
                  }, _callee);
                }));
                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }());
              _context2.n = 4;
              break;
            case 3:
              _context2.p = 3;
              _t = _context2.v;
              console.log("Background: Unable to perform scan. Error: ".concat(_t));
            case 4:
              return _context2.a(2);
          }
        }, _callee2, null, [[1, 3]]);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    return true;
  }
});

// function for checking the scanned email content against JSON rules
function checkScan(jsonFile, scanResults) {
  var emailTextObject = scanResults.results.emailText;
  var emailText = Object.values(emailTextObject).join(" ").toLowerCase();
  var emailLinksObject = scanResults.results.emailLinks;
  var emailLinks = Object.values(emailLinksObject).join(" ").toLowerCase();
  console.log("Backgorund:\nEmail Text: ".concat(emailText));
  console.log("Background: Starting check of scans");
  var foundRules = [];
  var wordsToHighlight = [];
  try {
    var _loop = function _loop() {
      var rule = jsonFile[i];
      var words = rule.words;
      var foundWords = [];
      var foundLinks = [];
      words.forEach(function (word) {
        var regularExpression = new RegExp("\\b".concat(word, "\\b"), "i");
        if (regularExpression.test(emailText) || regularExpression.test(emailLinks)) {
          foundWords.push(word);
          wordsToHighlight.push(word);
        }
      });

      //!Logic fo links to be added later as links rules have not yet been completed

      if (foundWords.length > 0) {
        if (foundLinks.length > 0) {
          foundRules.push({
            description: rule.description,
            words: foundWords,
            links: foundLinks
          });
        } else {
          foundRules.push({
            description: rule.description,
            words: foundWords,
            links: "Not found"
          });
        }
      }
    };
    for (var i = 0; i < jsonFile.length; i++) {
      _loop();
    }
    if (foundRules.length > 0) {
      console.log("Background: Rules found: ".concat(foundRules[0].description));
    } else {
      console.log("Background: No rules found");
    }
    if (wordsToHighlight.length > 0) {
      console.log("Background:  Words that need to be highlighted: ".concat(wordsToHighlight));
    } else {
      console.log("Background: Nothing to highlight");
    }
    console.log("Background: Check completed");
    return {
      rules: foundRules,
      toHighlight: wordsToHighlight
    };
  } catch (error) {
    console.log("Background:  An error occured ".concat(error));
  }
}
/******/ })()
;
//# sourceMappingURL=background.js.map