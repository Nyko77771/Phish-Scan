 const urlDetectionController = () => {
  const url = window.location.href;

  let emailServiceDetected = false;

  let emailOpenedCheck = false;;

  if(
    url.includes("mail.google.com") ||
    url.includes("outlook.office365.com") ||
    url.includes("mail.yahoo.com") ||
    url.includes("icloud.com/mail/")){
      emailServiceDetected = true;
      console.log(`Service detected`);
  }

  if(
    url.includes("/mail/inbox/id/") ||
    url.includes("/mail/u/0/") ||
    url.includes("messageId") ||
    url.includes("#inbox")
  ){
    emailOpenedCheck = true;
    console.log(`Email opened`);
  }

  console.log(`Is service: ${emailServiceDetected}\nEmail opened: ${emailOpenedCheck}`)

  chrome.runtime.sendMessage({
message: "updateStatus",
emailServiceDetected,
emailOpenedCheck,
url
  })

 }


 setTimeout(urlDetectionController,1000);