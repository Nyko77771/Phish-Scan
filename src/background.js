//Creting a tab object for storing a pair of values
const tab = new Map();

//chrome Listener for incoming messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handling the status update request
  if (request.message === "updateStatus" && sender.tab) {
    const tabId = sender.tab.id.toString();
    // Setting the storage of the local opened tab
    chrome.storage.local.set({
      [tabId]: {
        emailServiceDetected: request.emailServiceDetected,
        emailOpenCheck: request.emailOpenedCheck,
        url: request.url,
      },
    });
  }
  // Handling the sending of local tab data
  if (request.message === "tabStatus") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const defaultResponse = {
        emailServiceDetected: false,
        emailOpenedCheck: false,
      };

      if (tabs.length === 0) {
        console.log(`No tabs open`);
        sendResponse(defaultResponse);
        return;
      }

      const tabId = tabs[0].id.toString();

      chrome.storage.local.get(tabId, (result) => {
        const tabData = result[tabId] || defaultResponse;

        sendResponse(tabData);
      });
    });
    return true;
  }

  // Handling the email scan request
  if (request.action === "startScan") {
    console.log("Background: Received Scan Request");
    const id = request.tabId;
    console.log(`Background: Tab ID: ${id}`);

    //Checking if the request contains an id
    if (!id) {
      console.log("Background: No id found");
      return;
    }

    //Sending a message to content.js
    chrome.tabs.sendMessage(
      id,
      { action: "scanPage", tabId: id },
      async (contentResponse) => {
        //Checking response
        if (!contentResponse) {
          sendResponse({ error: "No response from content.js" });
          return;
        }
        try {
          //Obtaining JSON rules
          const jsonRules = await fetch(
            chrome.runtime.getURL("phishing_rules.json")
          )
            .then((response) => {
              console.log("Background: Obtaining JSON format");
              return response.json();
            })
            .then((data) => {
              console.log("Background: Obtaining Fishing Data Rules");
              return data.phishing_detection_rules;
            });

          // Performing the check of the scan
          const results = checkScan(jsonRules, contentResponse);
          chrome.tabs.sendMessage(
            id,
            { action: "highlightPage", words: results.toHighlight, tabId: id },
            async (contentResponse2) => {
              if (!contentResponse2 || contentResponse2 === false) {
                console.log(`Background: Highlight failed`);
                sendResponse({ completed: false });
              }

              console.log(`Background: Highlighted Response Received`);
              sendResponse({ completed: true, rules: results.rules });
            }
          );
        } catch (error) {
          console.log(`Unable to perform scan. Error: ${error}`);
        }
      }
    );
    return true;
  }
});

// function for checking the scanned email content against JSON rules
function checkScan(jsonFile, scanResults) {
  const emailTextObject = scanResults.results.emailText;
  const emailText = Object.values(emailTextObject).join(" ").toLowerCase();
  const emailLinksObject = scanResults.results.emailLinks;
  const emailLinks = Object.values(emailLinksObject).join(" ").toLowerCase();

  console.log(`Backgorund:\nEmail Text: ${emailText}`);
  console.log("Background: Starting check of scans");

  var foundRules = [];
  var wordsToHighlight = [];

  try {
    for (let i = 0; i < jsonFile.length; i++) {
      const rule = jsonFile[i];
      const words = rule.words;
      const foundWords = [];
      const foundLinks = [];

      words.forEach((word) => {
        const regularExpression = new RegExp(`\\b${word}\\b`, "i");
        if (
          regularExpression.test(emailText) ||
          regularExpression.test(emailLinks)
        ) {
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
            links: foundLinks,
          });
        } else {
          foundRules.push({
            description: rule.description,
            words: foundWords,
            links: "Not found",
          });
        }
      }
    }

    if (foundRules.length > 0) {
      console.log(`Background: Rules found: ${foundRules[0].description}`);
    } else {
      console.log(`Background: No rules found`);
    }
    if (wordsToHighlight.length > 0) {
      console.log(
        `Background:  Words that need to be highlighted: ${wordsToHighlight}`
      );
    } else {
      console.log(`Background: Nothing to highlight`);
    }

    console.log(`Background: Check completed`);

    return {
      rules: foundRules,
      toHighlight: wordsToHighlight,
    };
  } catch (error) {
    console.log(`Background:  An error occured ${error}`);
  }
}
