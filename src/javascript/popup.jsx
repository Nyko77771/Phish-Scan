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
  const [displayRules, setRules] = useState(null);

  //using useEffect for html page update based on status received from the backgrounds
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.log("`Pop-up: No Active Tabs");
        return;
      }
      const tab = parseInt(tabs[0].id);
      setId(tab);
      console.log("`Pop-up: Tab ID set");
    });
  }, []);

  useEffect(() => {
    console.log(`Pop-up: Checking tabId`);
    console.log(`Pop-up: Tab ID: ${tabId}`);
    if (tabId === null) {
      console.log("`Pop-up: No ID set");
      return;
    }

    if (isNaN(tabId)) {
      console.log(`Pop-up: TabId is not a number`);
      return;
    }

    chrome.runtime.sendMessage(
      {
        message: "tabStatus",
      },
      (response) => {
        if (response) {
          console.log("Pop-up: Tab Status Response from Background.");
          setDetectionState(response.emailServiceDetected);
          setOpenState(response.emailOpenCheck);
        }
      }
    );
  }, [tabId]);

  console.log(`Pop-up: Service Detected Result: ${emailService}`);
  console.log(`Pop-up: Email Opened: ${emailOpened}`);

  const startScan = () => {
    console.log("Popup: Starting Scan");
    chrome.runtime.sendMessage({ action: "startScan", tabId }, (response) => {
      if (response.completed) {
        console.log("Pop-up: Scan has been completed");
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
              //onClick={performAnalysis}
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
