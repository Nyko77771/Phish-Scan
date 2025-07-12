const tab = new Map();

chrome.runtime.onMessage.addListener((request,sender)=>{
if(request.message === "updateStatus" && sender.tab){
tab.set(sender.tab.id, {
emailServiceDetected: request.emailServiceDetected,
emailOpenCheck: request.emailOpenCheck,
url: request.url
})
}
});

chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
  if(request.message === "tabStatus"){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
      if(tabs.length === 0){
        console.log(`No tabs open`);
        response(null);
        return;
      }
    const tabId = tabs[0].id;
    const tabData = tab.get(tabId)|| {emailServiceDetected: false, emailOpenCheck: false};

    sendResponse(tabData);
    })
    return true;
  }
})
