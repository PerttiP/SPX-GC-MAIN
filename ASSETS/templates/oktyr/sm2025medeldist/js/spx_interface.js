// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025 (medeldist)

let selectedClass;
let selectedRunnerBib;
let validRunnerSelectedInUI = true;

console.log("!!!! NOTE: This spx_interface.js script MUST EXECUTE FIRST !!!!");

// Set up a listener for event dispatched from spx_gc.js: (NOT WORKING)
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

// HARD-CODED MOCKTEST 2025-04-24:
const mockData_OneRunner = {
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

// Receive item data from SPX Graphics Controller
// and store values in hidden DOM elements for
// use in the template.

function update(data) {
  var templateData = JSON.parse(data);
  console.log("----- Update handler called with data:", templateData);

  console.log("----- Vald klass: ", templateData.f_vald_klass);
  console.log("----- Vald runner bib: ", templateData.f_vald_runner_bib);

  let apiData;
  let mockData;

  // MOCKTEST: Simulate an API response (will return Mock data for bib id 444)!
  fetchMockApiResponse(selectedClass, selectedRunnerBib).then((mockData) => {
    // Check if mockData exists before accessing its properties.
    if (mockData === null || mockData === undefined) {
      alert(
        "Fetch från API misslyckades!\n Välj klass och skriv giltigt startnummer\n Försök sedan på nytt!"
      );
      //return;

      // HARD-CODED MOCKTEST 2025-04-24: since now mockData is not returned from call above?
      let mockData_444 = {
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

      mockData = mockData_444;
    } //end if
    else {
      console.log("Mock API Response:", mockData);
    }
  }); // end .then

  apiData = mockData;

  // If you want to override values for f0, f1, and f2, you can define an object to map the new values:
  /*
  const fieldOverrides = {
    f0: apiData.runners[0].bib, // for example replace "9999" with "444"
    f1: apiData.runners[0].name,
    f2: apiData.runners[0].club,
  };
  */
  const fieldOverrides = {
    f0: "444", // for example replace "9999" with "444"
    f1: "New F1",
    f2: "New F2",
  };

  // Find an element in the DOM with an id matching the key
  // Loop through each field in the templateData object
  for (var dataField in templateData) {
    var idField = document.getElementById(dataField);
    if (idField) {
      // Check if this field should be overridden
      if (fieldOverrides.hasOwnProperty(dataField)) {
        idField.innerText = fieldOverrides[dataField];
        // For debugging, log the changes.
        console.log(
          "Updated element with id:",
          dataField,
          "to",
          idField.innerText
        );
      } else {
        // Otherwise use the value coming in from the templateData
        idField.innerText = templateData[dataField];
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
  } //end for

  // TODO: Check if dataField and templateData now have updated values for f1 and f2!

  // TODO: Check that we have retrieved a valid runner from API
  let validRunnerFoundFromAPI = true;

  if (typeof runTemplateUpdate === "function") {
    //runTemplateUpdate(apiData); // Play will follow
    runTemplateUpdate(mockData_OneRunner);
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

// Encoded HTML to plain text
// Any HTML-encoded parts in the input string are decoded, and the function returns the plain text.
function htmlDecode(txt) {
  var doc = new DOMParser().parseFromString(txt, "text/html");
  return doc.documentElement.textContent;
}

// Utility function
// Renamed the e() function since it clashes with other function also called e()!
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
  // Try to get from DOM
  let profileName = document.getElementById("profname").innerText;

  // Try to get from localStorage
  if (profileName == "") {
    // retrieve from localStorage
    profileName = localStorage.SPX_CT_ProfileName || "...";
  }
  return profileName;
} // getProfileForCurrent ended

// ----------------------------------------------------------------

// MOCKTEST: Mock function to simulate the API response
/*
  An async function always returns a Promise, regardless of whether you use await inside the function or not.
*/

// MOCKTEST for lowerThird and follow runner with bibnr:
async function fetchMockApiResponse(klass, bibnr) {
  // Simulated delay (like a real API call)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // MOCKTEST responding with one runner to follow (444)
  if (bibnr === "444") {
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
  } else if (bibnr === "0") {
    return {
      competition: "Medel-Kval",
      class: "H21",
      runners: [
        {
          bib: "0",
          name: "Test Runner",
          club: "OK Test",
          start_time: "14:40",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 0,
        },
      ],
    };
  }
  return null; // Explicitly return null if no match, else undefined would be returned
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

// MOCKTEST for splitTime:
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

console.log("!!!! Now spx_interface.js script has FINISHED !!!!");
