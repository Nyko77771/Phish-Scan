let emailDetected = false;
const currentUrl = window.location.href;

if (
  currentUrl.includes("mail.google.com") ||
  currentUrl.includes("outlook.office365.com") ||
  currentUrl.includes("mail.yahoo.com")
) {
  console.log("EMail Detected.");
  chrome.runtime.sendMessage({
    from: "content",
    action: "emailDetected",
  });
}

function detectChange(url) {}
