// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

console.warn("======== This version of this script is DEPRECATED!!! =========");

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

// Save persistently (as a string!)
localStorage.setItem("doUpdateEditorFieldLabels", JSON.stringify(false));

// Listen for event when HTML has been completely parsed and the DOM constructed (but before images and subframes have loaded).
// WARNING: This event will be triggered by SPX-GC also for PlayLayer events !!!
document.addEventListener("DOMContentLoaded", function () {
  if (typeof window.SPXGCTemplateDefinition !== "undefined") {
    currentTemplateDefinition = window.SPXGCTemplateDefinition;
    console.log(
      "currentTemplateDefinition has been set:",
      currentTemplateDefinition
    );

    // FIXME: Only rewrite this once for the session!!!
    let testFlag = JSON.parse(
      localStorage.getItem("doUpdateEditorFieldLabels")
    );
    // if (!testFlag) { // Only rewrite if we are NOT in the doUpdateEditorFieldLabels mode!
    // OR EVEN BETTER?:
    if (localStorage.getItem("currentTD_DataFields") === null) {
      // If the key doesn't exist, it returns null!
      let currentTD_DataFields = window.SPXGCTemplateDefinition.DataFields;
      console.log(
        "currentTD_DataFields has also been set:",
        currentTD_DataFields
      );

      console.log(typeof currentTD_DataFields);

      localStorage.setItem(
        "currentTD_DataFields",
        JSON.stringify(currentTD_DataFields)
      );
    } else {
      console.log(
        "Intentionally NOT rewriting the stored currentTD_DataFields!!!"
      );
    }
  } else {
    console.error("SPXGCTemplateDefinition is not defined on the window.");
  }
});

function getNewValueForField(field, newData) {
  switch (field) {
    case "f0":
      if (typeof newData.f0 === "string" || myVar instanceof String)
        return newData.f0; // new value for f0 (Bib)
      else if (typeof newData.f0 === "number" && Number.isInteger(newData.f0))
        return newData.f0.toString();
      else return newData[field]; // unchanged!
    case "f1":
      return newData.f1; // new value for f1 (Name)
    case "f2":
      return newData.f2; // new value for f2 (Club)
    default:
      return newData[field]; // unchanged!
  }
}

// TODO: test if this works:

// FIXME:
/*
spx_interface.js:56 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'DataFields')
*/
function updateRunnerDataFieldsInTemplateDefinition(newDataFields) {
  // Create a shallow clone of the DataFields array
  //  const updatedDataFields = window.SPXGCTemplateDefinition.DataFields.map(

  // FIXME?: undefined
  //  console.log(currentTemplateDefinition);

  let currentTD_DataFields = JSON.parse(
    localStorage.getItem("currentTD_DataFields")
  );

  console.log(currentTD_DataFields); //OK!

  let doReplace = false;
  let updatedDataFields = null;

  //if (currentTemplateDefinition && currentTemplateDefinition.DataFields) {
  if (currentTD_DataFields) {
    updatedDataFields = currentTD_DataFields.map(
      //currentTemplateDefinition.DataFields.map(
      (fieldItem) => {
        // Only modify the 'number' and 'caption' fields that we care about to change:
        if (
          (fieldItem.ftype === "caption" && //"textfield" &&
            ["f0", "f1", "f2"].includes(fieldItem.field)) ||
          (fieldItem.ftype === "number" && ["f0"].includes(fieldItem.field))
        ) {
          return {
            ...fieldItem,
            value: getNewValueForField(fieldItem.field, newDataFields),
          };
        }
        // Keep others intact:
        return fieldItem;
      }
    );

    console.log(
      "Will now try to update the window.SPXGCTemplateDefinition.DataFields..."
    );

    if (
      window.SPXGCTemplateDefinition &&
      window.SPXGCTemplateDefinition.DataFields
    ) {
      try {
        // Try to update the 'real' template definition with the new array...
        window.SPXGCTemplateDefinition.DataFields = updatedDataFields;
      } catch (error) {
        //console.log(window.SPXGCTemplateDefinition.DataFields);
        console.error("Failed to update the template definition", error);
        console.log("With updatedDataFields: ", updatedDataFields);
        doReplace = true;
      }
    } else {
      // If window template def not found, do replace
      doReplace = true;
    }
  } else {
    // If not stored, do replace
    doReplace = true;
  }

  // FIXME: Why not always replace if we have valid data in updatedDataFields...?

  if (doReplace) {
    // FALLBACK: Save the updatedDataFields to local storage...?
    localStorage.setItem(
      "currentTD_DataFields",
      JSON.stringify(updatedDataFields)
    );
    console.log("Replaced currentTD_DataFields with updatedDataFields");
  }

  // Trigger any re-rendering or template update as needed...
}

let newDataFromAPI = {
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

  // MOCKTEST responding with one runner to follow (444)
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
}
/*
async function fetchMockApiResponse(selKlass, selBib) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        // resolve should return an object with a runners property
        runners: [{ name: "Ferry Fyråsen", bib: "444" }],
      });
    }, 500);
  });
}
*/
async function fetchMockApiResponseMany(klass) {
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

// -------------------------------------- MOCK DATA END

let selectedClass;
let selectedRunnerBib;
// Flag for update(data) function:
//let doUpdateTemplateDataFields = false;

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
/* FIXME: Not working correctly
async function checkRunners(runners) {
  // Check if `runners` is an array and then its length.
  if (runners && Array.isArray(runners)) {
    if (runners.length === 1) {
      console.log("Fetched 1 runner.");
      return 1;
    } else {
      console.log(`Fetched ${runners.length} runners.`);
      return runners.length;
    }
  } else {
    console.error("The runners property is missing or not an array.");
    return 0;
  }
}
*/
function refetchRunnersData() {
  //alert("refetchRunnersData() CALLED!"); // OK!

  if (!getDataFromLocalStorage()) {
    console.warn("Failed to get data from local storage");
    return;
  }

  // TODO: API request

  // MOCKTEST: Simulate an API response (will return Mock data for class D21 or H21)!
  fetchMockApiResponse(selectedClass, selectedRunnerBib).then((mockData) => {
    console.log("Mock API Response:", mockData);
  });
}

function followSelectedRunner() {
  alert("followSelectedRunner() CALLED!"); // OK!

  if (!getDataFromLocalStorage()) {
    console.warn("Failed to get data from local storage");
    return;
  }

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

  // TODO: Now in update()
  // We want to substitute data in the overlay and in 'caption' labels of editor.
  let doUpdateFlag = true;
  localStorage.setItem(
    "doUpdateEditorFieldLabels",
    JSON.stringify(doUpdateFlag)
  );

  console.log("Has this flag been set to string representation of 'true'?");
  // Debug: immediately check the stored value
  console.log(JSON.parse(localStorage.getItem("doUpdateEditorFieldLabels"))); // Should log: true

  // USE CASE 1: We are following ONE (1) runner:
  /*
    let numRunners = checkRunners(mockData.runners);
    console.log("numRunners: ", numRunners);
    */
  if (mockData.runners && Array.isArray(mockData.runners)) {
    if (mockData.runners.length === 1) {
      console.log("Fetched 1 runner.");

      newDataFromAPI.f_list_titel = "Split";
      newDataFromAPI.f_vald_klass = mockData.class;
      newDataFromAPI.f_vald_kontroll = "LÄGG TILL RC";

      if (Array.isArray(mockData.runners)) {
        newDataFromAPI.f0 = mockData.runners[0].bib;
        newDataFromAPI.f1 = mockData.runners[0].name;
        newDataFromAPI.f2 = mockData.runners[0].club;
      } else {
        newDataFromAPI.f0 = mockData.runners.bib;
        newDataFromAPI.f1 = mockData.runners.name;
        newDataFromAPI.f2 = mockData.runners.club;
      }
      console.log("Received newDataFromAPI: ", newDataFromAPI);
    } else {
      console.log("Received many runners data from API");
    }

    // FIXME: Update window.SPXGCTemplateDefinition.DataFields
    updateRunnerDataFieldsInTemplateDefinition(newDataFromAPI);
  }
}

function followSelectedRunner_2() {
  alert("followSelectedRunner_2() CALLED!");

  if (!getDataFromLocalStorage()) {
    console.warn("Failed to get data from local storage");
    return;
  }

  // TODO: API request

  let mockData; // Added for context?

  // MOCKTEST: Simulate an API response (will return Mock data for bib id 444)!
  fetchMockApiResponse(selectedClass, selectedRunnerBib).then((mockData) => {
    // Check if mockData exists before accessing its properties.
    if (mockData === null || mockData === undefined) {
      alert(
        "Fetch från API misslyckades!\n Välj klass och skriv giltigt startnummer\n Försök sedan på nytt!"
      );
      //return;

      // HARD-CODED MOCKTEST 2025-04-24: since now mockData is not returned from call above?
      mockData = {
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

    console.log("Mock API Response:", mockData);

    // TODO: Now in update()
    // We want to substitute data in the overlay and in static labels of editor.
    //  doUpdateEditorFieldLabels = true;

    /*
    // Mock data
    // 
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
    */

    // USE CASE 1: We are following ONE (1) runner:
    /*
    let numRunners = checkRunners(mockData.runners);
    console.log("numRunners: ", numRunners);
    */
    if (mockData.runners && Array.isArray(mockData.runners)) {
      if (mockData.runners.length === 1) {
        console.log("Fetched 1 runner.");

        newDataFromAPI.f_list_titel = "Split";
        newDataFromAPI.f_vald_klass = mockData.class;
        newDataFromAPI.f_vald_kontroll = "LÄGG TILL RC";

        if (Array.isArray(mockData.runners)) {
          newDataFromAPI.f0 = mockData.runners[0].bib;
          newDataFromAPI.f1 = mockData.runners[0].name;
          newDataFromAPI.f2 = mockData.runners[0].club;
        } else {
          newDataFromAPI.f0 = mockData.runners.bib;
          newDataFromAPI.f1 = mockData.runners.name;
          newDataFromAPI.f2 = mockData.runners.club;
        }
        console.log("Received newDataFromAPI: ", newDataFromAPI);
      } else {
        console.log("Received many runners data from API");
      }

      // FIXME: Update window.SPXGCTemplateDefinition.DataFields
      updateRunnerDataFieldsInTemplateDefinition(newDataFromAPI);
    }
  });
}

// Receive item data from SPX Graphics Controller
// and store values in hidden DOM elements for
// use in the template.
// WARNING: This function is most likely called by SPX-GC server and thus
// it executes in server-side context and CANNOT reliably retrieve
// "global" data or data in local storage at the client-side/browser context!!!
function update(data) {
  let templateData = null;

  let testFlag = JSON.parse(localStorage.getItem("doUpdateEditorFieldLabels")); // JSON parse to boolean!
  console.log("testFlag", testFlag);
  console.log("typeof testFlag: ", typeof testFlag);

  if (testFlag) alert("testFlag IS boolean true!!!"); // WARNING: I NEVER see this alert!!!

  if (testFlag || testFlag === "true") {
    templateData = new SPXTemplateData(newDataFromAPI);
    if (newDataFromAPI) {
      //FIXME: actually unnecessary right now?
      templateData.updateField("f0", newDataFromAPI.f0);
      templateData.updateField("f1", newDataFromAPI.f1);
      templateData.updateField("f2", newDataFromAPI.f2);
    }
    console.log("##### doUpdateEditorFieldLabels !!!!!");
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

  // TODO: Reset flag?
  //  doUpdateEditorFieldLabels = false;
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
