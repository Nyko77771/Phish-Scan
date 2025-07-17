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
    console.log(`Tab ID: ${request.tabId}`);

    //Checking if the request contains an id
    if (!request.tabId) {
      console.log("No id found");
      return;
    }

    //Sending a message to content.js
    chrome.tabs.sendMessage(
      request.tabId,
      { action: "scanPage", tabId: request.tabId },
      async (contentResponse) => {
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
              console.log("Obtaining JSON format");
              return response.json();
            })
            .then((data) => {
              console.log("Obtaining Fishing Data Rules");
              return data.phishing_detection_rules;
            });

          // Performing the check of the scan
          const results = checkScan(jsonRules, contentResponse);
        } catch (error) {
          console.log(`Unable to perform scan. Error: ${error}`);
        }
      }
    );
    return true;
  }
});

function checkScan(jsonFile, scanResults) {
  /*
  console.log(`JSON file: ${jsonFile}`);
  console.log(`Scan Results: ${scanResults.results.emailText}`);
  */

  console.log("Starting check of scans");
}
