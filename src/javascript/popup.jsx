import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// creating the html page components variable
const MyComponents = () => {
  //defining the state for variable emailService and documentScanned using React's useState
  //adding a function for each variable to update their state
  const [emailService, setDetectionState] = useState(false);
  const [emailOpened, setOpenState] = useState(false);
  const [documentScanned, setScanState] = useState(false);

  //using useEffect for html page update based on status received from the backgrounds
  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        message: "tabStatus",
      },
      (response) => {
        setDetectionState(response.emailServiceDetected);
        setOpenState(response.emailOpenCheck);
        console.log(`Service Detected Result: ${emailService}`);
        console.log(`Email Opened: ${emailOpened}`);
      }
    );
  }, []);

  return (
    <div className="mainContainer">
      <div id="section1">
        <img src="logo.png" alt="logo" />
        <h1 id="mainTitle">Phishing Scanner</h1>
      </div>
      <div id="section2"></div>
      <div id="section3">
        <span className="line1"></span>
        {emailService ? (
          <>
            <h1 id="notice1">Email Service:</h1>
            <h2 id="notice2">Detected</h2>
          </>
        ) : (
          <h1 id="notice1">No Email Detected</h1>
        )}
      </div>
      <div id="section4"></div>
      <div id="section5">
        {emailOpened && (
          <input type="button" id="btn1" value="Scan Email!"></input>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<MyComponents />);
