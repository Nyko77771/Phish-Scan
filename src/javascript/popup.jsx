import React from "react";
import { createRoot } from "react-dom/client";
//import ExtensionPopup from "./index";

const EmailDetected = ({ emailService, documentScanned }) => (
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
          <h1 id="notice1">Email Service Detected</h1>
          <h2 id="notice2">Detected</h2>
        </>
      ) : (
        <h1 id="notice1">No Email Detected</h1>
      )}
    </div>

    {emailService ? (
      <>
        <div id="section4">
          <input type="button" id="btn1" value="Scan Email!"></input>
        </div>
      </>
    ) : (
      <div id="section4"></div>
    )}

    <div id="section5"></div>
  </div>
);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<EmailDetected />);
