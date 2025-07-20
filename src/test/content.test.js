const {
  emailOpenController,
  urlDetectionController,
  scanPage,
} = require("./content-copy");

//Testing emailOpenController
//Test without https
/*
test("Return Gmail", () => {
  expect(emailOpenController("mail.google.com/mail/u/0/#inbox/abc")).toBe(
    "Gmail"
  );
});

//Test with /#inbox\/[a-zA-Z0-9]+/
test("Return Gmail", () => {
  expect(
    emailOpenController("https://mail.google.com/mail/u/0/#inbox/abc")
  ).toBe("Gmail");
});

//Test without /#inbox\/[a-zA-Z0-9]+/
test("Return Gmail", () => {
  expect(emailOpenController("https://mail.google.com/mail/u/0/")).not.toBe(
    "Gmail"
  );
});

//Test without /#inbox\/[a-zA-Z0-9]+/
test("Return Gmail", () => {
  expect(emailOpenController("https://mail.apple.com/mail/u/0/")).not.toBe(
    "Gmail"
  );
});
*/

//Test urlDetectionController
test("New URL and Last URL = https://www.GoodBye.com", () => {
  expect(urlDetectionController("https://www.GoodBye.com")).toBe(
    "Last URL = https://www.hello.com\nCurrent URL = https://www.GoodBye.com\nNew URL = https://www.GoodBye.com"
  );
});

//Testing Scan Page
