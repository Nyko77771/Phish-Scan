//URL Identifier
function emailOpenController(providedUrl) {
  const url = providedUrl;

  let emailServiceDetected = false;
  let emailOpenedCheck = false;

  if (
    url.includes("mail.google.com") ||
    url.includes("outlook.office365.com") ||
    url.includes("outlook.live.com") ||
    url.includes("mail.yahoo.com") ||
    url.includes("icloud.com/mail/")
  ) {
    emailServiceDetected = true;
    console.log(`Content: Service detected`);
  }

  if (emailServiceDetected) {
    if (
      url.includes("mail.google.com/mail/u/0/") &&
      url.match(/#inbox\/[a-zA-Z0-9]+/)
    ) {
      emailOpenedCheck = true;
      console.log(`Gmail: Email opened`);
      return "Gmail";
    }

    if (
      (url.includes("outlook.office365.com/mail/") ||
        url.includes("outlook.live.com/mail/")) &&
      (url.match(/\/mail\/inbox\/id\/[a-zA-Z0-9]+/) ||
        url.match(/\/mail\/[0-9]+\/sentiments\/id\/[a-zA-Z0-9]+/))
    ) {
      emailOpenedCheck = true;
      console.log(`Outlook: Email opened`);
      return "Outlook";
    }
    // Checking for Yahoo
    if (url.includes("mail.yahoo.com") && url.includes("/d/message/")) {
      emailOpenedCheck = true;
      console.log(`YahooMail: Email opened`);
      return "Yahoo";
    }
    // Checking Icloud
    if (
      url.includes("icloud.com/mail") &&
      url.match(/#.*\/message\/[a-zA-Z0-9]+/)
    ) {
      emailOpenedCheck = true;
      console.log(`Apple: Email opened`);
      return "Apple";
    }
  }
}

function urlDetectionController(url) {
  let lastUrl = "https://www.hello.com";
  let currentUrl = url;
  let newUrl;

  if (currentUrl != lastUrl) {
    console.log(`Content: URL Changed`);
    console.log(`Content: Old URL: ${lastUrl}`);
    console.log(`Content: New URL: ${currentUrl}`);
    //Setting last URL to be the new/current URL
    newUrl = currentUrl;
    //Calling on emailOpenController to check Service and Email
    return `Last URL = ${lastUrl}\nCurrent URL = ${currentUrl}\nNew URL = ${newUrl}`;
  }
}

function scanPage(httpContent) {
  const emailContainer = httpContent;

  if (!emailContainer) {
    console.log(`Content: No email body found`);
    return {
      emailText: [],
      emailLinks: [],
    };
  }

  const tags = ["h1", "h2", "h3", "h4", "p", "span ", "div", "a"];

  var emailContent = [];
  var emailLinks = [];

  tags.forEach((tag) => {
    const elements = emailContainer.querySelectorAll(tag);
    elements.forEach((element) => {
      if (element.innerText) {
        const text = element.innerText.trim();
        if (text) {
          emailContent.push(text);
        }
      }

      if (element.tagName.toLowerCase() === "a" && element.href) {
        emailLinks.push({ link: element.href, text: element.innerText.trim() });
      }
    });
  });

  console.log(`Content: Finished Email Scan`);

  return {
    emailText: emailContent,
    emailLinks: emailLinks,
  };
}

//
module.exports = { emailOpenController, urlDetectionController, scanPage };
