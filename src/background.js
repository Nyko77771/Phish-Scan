const tab = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "updateStatus" && sender.tab) {
    const tabId = sender.tab.id.toString();
    chrome.storage.local.set({
      [tabId]: {
        emailServiceDetected: request.emailServiceDetected,
        emailOpenCheck: request.emailOpenedCheck,
        url: request.url,
      },
    });
  }
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

  if (request.action === "startScan") {
    console.log("Received Scan Request");

    if (!request.tabId) {
      console.log("No id found");
      return;
    }

    chrome.tabs.sendMessage(
      request.tabId,
      { action: "scanPage" },
      async (response) => {
        if (!response) {
          sendResponse({ error: "No response from content.js" });
          return;
        }
        try {
          const rules = await fetch(
            chrome.runtime.getURL("phishing_rules.json")
          )
            .then((response) => {
              console.log("Obtaining JSON format");
              response.json();
            })
            .then((data) => {
              console.log("Obtaining Fishing Data Rules");
              data.phishing_detection_rules;
            });

          const results = checkScan();
        } catch (error) {
          console.log(`Unable to perform scan. Error: ${error}`);
        }
      }
    );
    return true;
  }
});
