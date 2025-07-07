let emailDetected = false;
const currentUrl = window.location.href;

// Checking Email Presence (Big Email Providors)

if (
  currentUrl.includes("mail.google.com") ||
  currentUrl.includes("outlook.office365.com") ||
  currentUrl.includes("mail.yahoo.com") ||
  currentUrl.includes("icloud.com/mail/")
) {
  console.log("EMail Detected.");
  detectChange();
}

//Detecting
function detectChange() {
  newUrl = window.location.href;
  if (newUrl !== currentUrl) {
    console.log("URL is different");
    if (
      newUrl.includes("/mail/inbox/id/") ||
      newUrl.includes("/mail/u/0/#inbox/") ||
      newUrl.includes("messageID") ||
      newUrl.includes("#inbox")
    ) {
      console.log("Detected email opened");

      chrome.runtime.sendMessage({
        from: "content",
        action: "emailDetected",
      });
    }
  }
}
