import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// creating the html page components variable
const MyComponents = () => {
  //defining the state for variable emailService, emailOpened and documentScanned using React's useState
  //adding a function for each variable to update their state
  //Also using useState for defining the id of an open tab
  const [tabId, setId] = useState(null);
  const [emailService, setDetectionState] = useState(false);
  const [emailOpened, setOpenState] = useState(false);
  const [documentScanned, setScanState] = useState(false);

  //using useEffect for html page update based on status received from the backgrounds
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.log("No Active Tabs");
        return;
      }
      setId(tabs[0].id);
    });
  }, []);

  useEffect(() => {
    if (tabId === null) {
      console.log("No ID set");
      return;
    }

    chrome.runtime.sendMessage(
      {
        message: "tabStatus",
      },
      (response) => {
        if (response) {
          console.log(`Response from background: ${response}`);
          setDetectionState(response.emailServiceDetected);
          setOpenState(response.emailOpenCheck);
        }
      }
    );
  }, [tabId]);

  console.log(`Service Detected Result: ${emailService}`);
  console.log(`Email Opened: ${emailOpened}`);

  const startScan = () => {
    console.log("Popup: Starting Scan");
    chrome.runtime.sendMessage({ action: "startScan", tabId }, (response) => {
      if (response.completed) {
        console.log("Scan has been completed");
        setScanState(response.completed);
      }
    });
  };

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
          <input
            type="button"
            id="btn1"
            value="Scan Email!"
            onClick={startScan}
          ></input>
        )}
      </div>
      {documentScanned && (
        <>
          <div id="section6"></div>
          <div id="section7">
            <input
              type="button"
              id="btn2"
              value="Perform Analysis"
              onClick={performAnalysis} // If you want this to do something
            />
          </div>
          <div id="section8"></div>
        </>
      )}
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<MyComponents />);
