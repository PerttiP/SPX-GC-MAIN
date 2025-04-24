// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025.

// TEST1: Can client side access the global type from Node.js ? */
/*
test = global.configfileref;
console.log("global.configfileref: ", global.configfileref);
*/
// TEST1 ANSWER: No it cannot

// TEST2: Can client side access JSDOM ?
// Original method using just JSDOM
//const dom = new JSDOM(templatehtml, { runScripts: "dangerously" });
// TEST2 ANSWER: No, For browser-based HTML parsing, use the native DOMParser API instead of JSDOM.

// TEST3:
// From client-side the actual DOM resides directly on the global window object
let currentTemplateDefinition;

// Listen for event when HTML has been completely parsed and the DOM constructed (but before images and subframes have loaded).
document.addEventListener("DOMContentLoaded", function () {
  if (typeof window.SPXGCTemplateDefinition !== "undefined") {
    currentTemplateDefinition = window.SPXGCTemplateDefinition;
    console.log(
      "SPXGCTemplateDefinition has been set:",
      currentTemplateDefinition
    );
  } else {
    console.error("SPXGCTemplateDefinition is not defined on the window.");
  }
});

let doUpdateEditorFieldLabels = false;

const newDataFromAPI = {
  comment: "[ PLACE BIB-NR NAME TIME ]",
  f_list_titel: "Split",
  f_vald_klass: "",
  f_vald_kontroll: "",
  f0: "",
  f1: "",
  f2: "",
  f99: "",
};

// MOCKTEST: Mock function to simulate the API response
/*
  An async function always returns a Promise, regardless of whether you use await inside the function or not.
*/
async function fetchMockApiResponse(klass, bibnr) {
  // Simulated delay (like a real API call)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // MOCTKEST responding with one runner to follow (444)
  if (bibnr === "444") {
    // Mock data
    return {
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

  // MOCKTEST responding with several runners in a specific class (D21 or H21)
  if (klass === "D21") {
    // Mock data
    return {
      competition: "Medel-Kval",
      class: "D21",
      runners: [
        {
          bib: "101",
          name: "Anna Andersson",
          club: "OK Tyr",
          start_time: "12:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 1,
        },
        {
          bib: "102",
          name: "Lisa Bergström",
          club: "IFK Göteborg",
          start_time: "12:02",
          split_times: [2520, 5190, 7950],
          final_time: 10950,
          place: 2,
        },
        {
          bib: "103",
          name: "Karin Johansson",
          club: "OK Djerf",
          start_time: "12:04",
          split_times: [2580, 5300, 8080],
          final_time: 11200,
          place: 3,
        },
      ],
    };
  } else if (klass === "H21") {
    // Mock data
    return {
      competition: "Medel-Kval",
      class: "H21",
      runners: [
        {
          bib: "201",
          name: "Johan Olsson",
          club: "OK SKogsmårdarna",
          start_time: "14:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 1,
        },
        {
          bib: "202",
          name: "Pär Hultgren",
          club: "IFK Malmö",
          start_time: "14:02",
          split_times: [2520, 5190, 7950],
          final_time: 10950,
          place: 2,
        },
        {
          bib: "203",
          name: "Kalle Arvidsson",
          club: "OK Björnen",
          start_time: "14:04",
          split_times: [2580, 5300, 8080],
          final_time: 11200,
          place: 3,
        },
      ],
    };
  }
}

let selectedClass;
let selectedRunnerBib;
// Flag for update(data) function:
let doUpdateTemplateDataFields = false;

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
  return true;
}

function refetchRunnersData() {
  //alert("refetchRunnersData() CALLED!"); // OK!

  if (!getDataFromLocalStorage()) return;

  // TODO: API request

  // MOCKTEST: Simulate an API response (will return Mock data for class D21 or H21)!
  fetchMockApiResponse(selectedClass, selectedRunnerBib).then((mockData) => {
    console.log("Mock API Response:", mockData);
  });
}

function followSelectedRunner() {
  alert("followSelectedRunner() CALLED!"); // OK!

  if (!getDataFromLocalStorage()) return;

  // TODO: API request

  // MOCKTEST: Simulate an API response (will return Mock data for bib id 444)!
  fetchMockApiResponse(selectedClass, selectedRunnerBib).then((mockData) => {
    console.log("Mock API Response:", mockData);

    // TODO: Now in update()
    // We want to substitute data in the overlay and in static labels of editor.
    doUpdateEditorFieldLabels = true;

    /*
    // Mock data
    return {
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
    */

    newDataFromAPI.f_list_titel = "Split";
    newDataFromAPI.f_vald_klass = mockData.class;
    newDataFromAPI.f_vald_kontroll = "LÄGG TILL RC";
    newDataFromAPI.f0 = mockData.runners.bib;
    newDataFromAPI.f1 = mockData.runners.name;
    newDataFromAPI.f2 = mockData.runners.club;
  });
}

// Receive item data from SPX Graphics Controller
// and store values in hidden DOM elements for
// use in the template.

function update(data) {
  const templateData = null;

  if (doUpdateEditorFieldLabels) {
    if (newDataFromAPI) {
      newTemplateDataFromAPI.updateField("f0", newDataFromAPI.f0);
      newTemplateDataFromAPI.updateField("f1", newDataFromAPI.f1);
      newTemplateDataFromAPI.updateField("f2", newDataFromAPI.f2);
    }
    templateData = new SPXTemplateData(newDataFromAPI);
  } else {
    console.log("----- Update handler called with data:", data);
    // Parse the incoming JSON data and create our structured object.
    const parsedData = JSON.parse(data);
    templateData = new SPXTemplateData(parsedData);
  }

  console.log("----- Update handler using templateData:", templateData);

  // --- Programmatically update the f1 and f2 fields ---
  // For example, you might grab new values from somewhere or compute them:
  // THIS TEST WORKED FOR GRAPHIC OVERLAY (but not for editor):
  /*
  const newF1Value = "Updated Fullname"; // e.g., calculate or get user input
  const newF2Value = "Updated Club Name";
  templateData.updateField("f1", newF1Value);
  templateData.updateField("f2", newF2Value);
  */

  // --- Update any DOM elements associated with our data ---
  // This replaces the loop you already had.
  templateData.updateDom();

  // --- Call the SPX provided template update function ---
  if (typeof runTemplateUpdate === "function") {
    runTemplateUpdate(); // This triggers the graphic overlay update.
  } else {
    console.error("runTemplateUpdate() function missing from SPX template.");
  }
}

/*
function update(data) {
  var templateData = JSON.parse(data);
  console.log("----- Update handler called with data:", templateData);
  // Update any DOM elements associated with our data
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

  if (typeof runTemplateUpdate === "function") {
    runTemplateUpdate(); // Play will follow
  } else {
    console.error("runTemplateUpdate() function missing from SPX template.");
  }
}
*/

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
