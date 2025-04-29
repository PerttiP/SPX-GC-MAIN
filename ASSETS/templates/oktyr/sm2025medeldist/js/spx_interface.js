// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025 (medeldist)

let selectedClass;
let selectedRunnerBib;
let validRunnerSelectedInUI = true;

console.log("!!!! NOTE: This spx_interface.js script MUST EXECUTE FIRST !!!!");

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

// Editor button click handler
function updateFollowedRunner() {
  //alert("updateFollowedRunner() CALLED!");

  getSelectedDataFromTemplate();

  // HARD-CODED MOCKTEST 2025-04-24:
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

function getSelectedDataFromTemplate() {
  e("vald_klass").innerHTML = htmlDecode(e("f_vald_klass").innerText);

  // If selected a bib from dropdown
  if (e("f_vald_runner_bib").innerText) {
    e("vald_runner_bib").innerHTML = htmlDecode(
      e("f_vald_runner_bib").innerText
    );
  } else {
    alert(
      "No runner selected! Trying to use runner id from input text field.\n Note that you may select a runner in dropdown\n."
    );

    // If not valid runner selected, then check if user has entered a bib number into input control?
    if (e("f0").innerText !== "") {
      // TODO: Check that it is a number!
      e("vald_runner_bib").innerHTML = htmlDecode(e("f0").innerText);

      validRunnerSelectedInUI = true;
    } else {
      alert(
        "No runner selected! Please either select a runner in dropdown\n or write a valid runner id in input text field."
      );
      validRunnerSelectedInUI = false;
      return false; // <----------- RETURN!
    }
  }

  // Get the vald klass from dropdown
  // NOTE: The value property is only available for form elements
  // like <input>, <textarea>, or <select>.
  let element = document.getElementById("f_vald_klass");
  console.log(element);

  if (typeof element != "undefined" && element != null) {
    // NOTE: Use innerText to get the content of the div.
    selectedClass = element.innerText;

    // Save persistently
    if (selectedClass) {
      localStorage.setItem("selectedClass", selectedClass);
      console.log("selectedClass saved: ", selectedClass);
    }
  }

  // First try to get the bib number from dropdown
  let elem_runner = document.getElementById("f_vald_runner");

  if (typeof elem_runner != "undefined" && elem_runner != null) {
    // NOTE: Use innerText to get the content of the div.
    selectedRunnerBib = elem_runner.innerText;

    // Save persistently
    if (selectedRunnerBib) {
      localStorage.setItem("selectedRunnerBib", selectedRunnerBib);
      console.log("selectedRunnerBib saved: ", selectedRunnerBib);
    } else {
      validRunnerSelectedInUI = false;
    }
  }
  if (!validRunnerSelectedInUI) {
    // Try to get the runner bib number from editable input textfield instead
    selectedRunnerBib = htmlDecode(e("f0").innerText);
    //alert(selectedRunnerBib);
    if (selectedRunnerBib) {
      localStorage.setItem("selectedRunnerBib", selectedRunnerBib);
      console.log("BibNr saved", selectedRunnerBib);
    } else {
      console.error("Failed to get runner bib number from editor controls");
      return false; // <----------- RETURN!
    }
  }

  return true;
}

// ----------------------------------------------------------------

console.log("!!!! Now spx_interface.js script has FINISHED !!!!");
