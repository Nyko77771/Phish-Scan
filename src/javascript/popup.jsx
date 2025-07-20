//importing few modules from react and react-dom
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
  const [showAlert, setAlert] = useState(false);

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

  //Using effect to check the id presence
  useEffect(() => {
    console.log(`Pop-up: Checking tabId`);
    console.log(`Pop-up: Tab ID: ${tabId}`);
    if (tabId === null) {
      console.log("`Pop-up: No ID set");
      return;
    }

    //Checking if id is a number
    if (isNaN(tabId)) {
      console.log(`Pop-up: TabId is not a number`);
      return;
    }

    //Getting status of service and email
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

  //Checking the returned results
  /*
  console.log(`Pop-up: Service Detected Result: ${emailService}`);
  console.log(`Pop-up: Email Opened: ${emailOpened}`);
  */

  //Function for initialising the scan
  const startScan = () => {
    console.log("Popup: Starting Scan");
    //Sending message to background to start the process
    chrome.runtime.sendMessage({ action: "startScan", tabId }, (response) => {
      //Checking the response received
      if (response.completed) {
        console.log("Pop-up: Scan has been completed");
        setScanState(response.completed);
        //Checking for rule presence
        if (response.rules && response.rules.length > 0) {
          console.log(`Pop-up: Rules are present`);
          setRules(response.rules);
        } else {
          console.log(`Pop-up: No rules present`);
        }
      }
    });
  };

  // Function for creating custom alert message
  const createAlert = () => {
    console.log(`Pop-up: Creating the alert message`);
    setAlert(true);
  };

  const hideAlert = () => {
    console.log(`Pop-up: Removing the alert message`);
    setAlert(false);
  };

  //Returning custom html page
  return (
    <>
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
                value="Show Details"
                onClick={createAlert}
              />
            </div>
            <div id="section8"></div>
          </>
        )}
      </div>

      {/* Custom Alert Pop-up */}

      {showAlert && (
        <>
          <div className="alertBox">
            <div className="alertItems">
              {displayRules != null && displayRules.length > 0 ? (
                <>
                  <h3>Found Phishing Rules!</h3>
                  <table>
                    {displayRules.map((rule, i) => (
                      <tr key={i}>
                        <th>{rule.description}:</th>
                        <td>{rule.words.join(", ")}</td>
                        <td>{rule.link}</td>
                      </tr>
                    ))}
                  </table>
                </>
              ) : (
                <>
                  <h3>No Rules Detected!</h3>
                </>
              )}
              <button id="btnA1" onClick={hideAlert}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

//Getting the root div from popup.html
const container = document.getElementById("root");
//Creating a root inside the defined container to display React components
const root = createRoot(container);

//Visually rendering my components inside popup.html
root.render(<MyComponents />);
