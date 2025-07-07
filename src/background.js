chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`Message received: ${request}`);
  console.log(`Sender is ${sender}.`);
  sendResponse({ message: "received" });
});
