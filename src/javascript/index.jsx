import React from "react";

const initialPopup = () => {
  return (
    <div class="mainContainer">
      <div id="section1">
        <img src="../assets/logo.png" />
        <h1 id="mainTitle">Phishing Scanner</h1>
      </div>
      <div id="section2"></div>
      <div id="section3">
        <span class="line1"></span>
        <h1 id="notice1"></h1>
        <h2 id="notice2"></h2>
      </div>
      <div id="section4"></div>
      <div id="section5">
        <input type="button" id="btn1" value="Scan Email!" />
      </div>
    </div>
  );
};

export default initialPopup;
