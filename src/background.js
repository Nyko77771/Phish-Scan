chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Message received: ${message}`);
  console.log(`Sender is ${sender}.`);
  sendResponse({ message: "received" });
});
