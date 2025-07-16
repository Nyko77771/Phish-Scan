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
  if (request.action === "scanEmail") {
    console.log("Received Scan Request");
    chrome.tabs.sendMessage(
      sender.tab.id,
      { action: "scanPage" },
      async (response) => {
        if (!response) {
          sendResponse({ error: "No response from content.js" });
          return;
        }
        const rules = await fetch(chrome.runtime.getURL("phishing_rules.json"))
          .then((response) => response.json())
          .then((data) => data.phishing_detection_rules);

        const results = checkScan();
      }
    );
  }
});
