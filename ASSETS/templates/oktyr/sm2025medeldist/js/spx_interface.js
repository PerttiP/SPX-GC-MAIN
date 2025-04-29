// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025 (medeldist)

let selectedClass;
let selectedRunnerBib;
let validRunnerSelectedInUI = true;

console.log("!!!! NOTE: This spx_interface.js script MUST EXECUTE FIRST !!!!");

// Set up a listener for event dispatched from spx_gc.js:
document.addEventListener("DOMContentLoaded", function () {
  console.log("!!!! DOM content loaded (spx_interface) !!!! ");

  // Listen for the custom "templateRundownItemSaved" event on window.
  window.addEventListener("templateRundownItemSaved", (event) => {
    // The event.detail carries the data you dispatched.
    console.log("Notified of template rundown item save:", event.detail);
  });
});

/* OK only if "globalExtras": { "customscript": "/templates/oktyr/sm2025medeldist/js/spx_interface.js" is defined! */
/*
window.updateFollowedRunner = function () {
  //alert("updateFollowedRunner() CALLED!");
  console.log("window.updateFollowedRunner called in spx_interface.js!");
};
*/

// TODO: Could we use local storage as a fallback to get 'previous' selected Runner's data?
function getDataFromLocalStorage() {
  selectedClass = localStorage.getItem("selectedClass");
  selectedRunnerBib = localStorage.getItem("selectedRunnerBib");

  if (selectedClass === null) {
    console.error("refetchRunnersData with selectedClass === null");
    alert("Refetch misslyckades! Välj klass och skriv giltigt startnummer!");
    return false;
  }
  if (selectedRunnerBib === null) {
    console.error("refetchRunnersData with selectedRunnerBib === null");
    alert("Refetch misslyckades! Välj klass och skriv giltigt startnummer!");
    return false;
  }
  console.log("selectedClass: ", selectedClass);
  console.log("selectedRunnerBib: ", selectedRunnerBib);
  return true;
}

// Editor button click handler
// KEEP FOR NOW AS LEGACY for backwards compatibility
function followSelectedRunner() {
  updateFollowedRunner();
}
/*
function runSaveDataFromTemplateUpdate() {
  alert("runSaveDataFromTemplateUpdate() called!");
}
*/
// In your JavaScript file (or inside a closure), attach the function to the window:
/*
window.runSaveDataFromTemplateUpdate = function () {
  console.log("Template update saved (from window)!");
  alert("window.runSaveDataFromTemplateUpdate() called!");
  // Your code goes here...
};
*/

// Editor button click handler
// TODO: MOVE THIS TO HTML BODY?:
/*
function updateFollowedRunner() {
  //alert("updateFollowedRunner() CALLED!");

  getSelectedDataFromTemplate();

  // ATTEMPT1: Move to body section in HTML???

  // WORKAROUND: Have 2 different cases for this function, pass in case1/case2 as argument?:
  /*
  if (typeof runTemplateUpdate === "function") {
    runTemplateUpdate(case1); // Play will follow
  } else {
    console.error("runTemplateUpdate() function missing from SPX template.");
  }
  */

// HARD-CODED MOCKTEST 2025-04-24:
/*
  const mockData = {
    competition: "Medel-Kval",
    class: "H21",
    runners: [
      {
        bib: "444",
        name: "Ferry Fyråsen",
        club: "OK Fyran",
        start_time: "14:44",
        split_times: [2450, 5080, 7840],
        final_time: 10800,
        place: 4,
      },
    ],
  };
}
*/
// Receive item data from SPX Graphics Controller
// and store values in hidden DOM elements for
// use in the template.

function update(data) {
  var templateData = JSON.parse(data);
  console.log("----- Update handler called with data:", templateData);
  for (var dataField in templateData) {
    var idField = document.getElementById(dataField);
    if (idField) {
      let fString = templateData[dataField];
      if (fString != "undefined" && fString != "null") {
        idField.innerText = fString;
      } else {
        idField.innerText = "";
      }
    } else {
      switch (dataField) {
        case "comment":
        case "epochID":
          // console.warn('FYI: Optional #' + dataField + ' missing from SPX template...');
          break;
        default:
          console.error(
            "ERROR Placeholder #" + dataField + " missing from SPX template."
          );
      }
    }
  }

  // TODO: Check that we have retrieved a valid runner from API
  let validRunnerFoundFromAPI = true;

  if (typeof runTemplateUpdate === "function") {
    runTemplateUpdate(); // Play will follow
  } else {
    console.error("runTemplateUpdate() function missing from SPX template.");
  }
}

// Play handler
function play() {
  // console.log('----- Play handler called.')
  if (typeof runAnimationIN === "function") {
    runAnimationIN();
  } else {
    console.error("runAnimationIN() function missing from SPX template.");
  }
}

// Stop handler
function stop() {
  // console.log('----- Stop handler called.')
  if (typeof runAnimationOUT === "function") {
    runAnimationOUT();
  } else {
    console.error("runAnimationOUT() function missing from SPX template.");
  }
}

// Continue handler
function next(data) {
  console.log("----- Next handler called.");

  if (typeof runAnimationNEXT === "function") {
    runAnimationNEXT();
  } else {
    console.error("runAnimationNEXT() function missing from SPX template.");
  }
}

// Encoded text to HTML
function htmlDecode(txt) {
  var doc = new DOMParser().parseFromString(txt, "text/html");
  return doc.documentElement.textContent;
}

// Utility function
/*
function e(elementID) {
  if (!elementID) {
    console.warn("Element ID is falsy, returning null.");
    return null;
  }
  if (!document.getElementById(elementID)) {
    console.warn("Element " + elementID + " not found, returning null.");
    return null;
  }
  return document.getElementById(elementID);
}
*/

function getEl(elementID) {
  if (!elementID) {
    console.warn("Element ID is falsy, returning null.");
    return null;
  }
  var el = document.getElementById(elementID);
  if (!el) {
    console.warn("Element " + elementID + " not found, returning null.");
    return null;
  }
  return el;
}

window.onerror = function (msg, url, row, col, error) {
  let err = {};
  err.file = url;
  err.message = msg;
  err.line = row;
  console.log(
    "%c" + "SPX Template Error Detected:",
    "font-weight:bold; font-size: 1.2em; margin-top: 2em;"
  );
  console.table(err);
  // spxlog('Template Error Auto Detected: file: ' + url + ', line: ' + row + ', msg; ' + msg,'WARN')
};

function validString(str) {
  let S = str.toUpperCase();
  // console.log('checking validString(' + S +');');
  switch (S) {
    case "UNDEFINED":
    case "NULL":
    case "":
      return false; // not a valid string
      break;
  }
  return true; // is a valid string
}

// ----------------------------------------------------------------------------------
/*
  Functionality copied/borrowed from ...\SPX-GC_1.3.3\SPX-GC-main\static\js\spx_gc.js

  WARN: USE WITH CARE! AND ONLY IF YOU KNOW FOR SURE WHAT YOU ARE DOING! :-)
*/
// ----------------------------------------------------------------------------------
function getProfileForCurrent() {
  // Try to get form DOM
  let profileName = document.getElementById("profname").innerText;

  // Try to get from localStorage
  if (profileName == "") {
    // retrieve from localStorage
    profileName = localStorage.SPX_CT_ProfileName || "...";
  }
  return profileName;
} // getProfileForCurrent ended

function setProfileForCurrent(profileName) {
  // FIXME: remove?
  // change profile to profileName and save to localStorage
  if (profileName == "") {
    // retrieve from localStorage
    profileName = localStorage.SPX_CT_ProfileName || "...";
  }
  document.getElementById("profname").innerText = profileName;
  localStorage.SPX_CT_ProfileName = profileName;
} // setProfileForCurrent ended

// ----------------------------------------------------------------

console.log("!!!! Now spx_interface.js script has FINISHED !!!!");
