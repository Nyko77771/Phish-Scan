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
});
