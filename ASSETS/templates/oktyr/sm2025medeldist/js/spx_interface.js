// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025 (medeldist)

// Save these 'persistently' in Local Storage?: for each Update or Play
let selectedClass;
let selectedRunnerBib; // A number!
let selectedRadioSplitId; // A number!

let templateType; // "lowerThird" or "split" or "other"

let stopWatch;
let shouldRunToggleTimerTask = false;
let doFreezeTimerOnce = false;

console.log("!!!! NOTE: This spx_interface.js script MUST EXECUTE FIRST !!!!");

document.addEventListener("DOMContentLoaded", function () {
  console.log("!!!! DOM content loaded (spx_interface) !!!! ");

  // Define and expose the function to global scope:
  window.pauseStopWatch = function (timeInSeconds) {
    if (stopWatch) {
      stopWatch.freeze(timeInSeconds);
      console.log("Stopwatch freezed for " + timeInSeconds + " seconds.");
    }
  };

  // Set up a listener for event dispatched from spx_gc.js: (NOT WORKING)
  // Listen for the custom "templateRundownItemSaved" event.
  // TODO: Use shared target!
  document.addEventListener("templateRundownItemSaved", (event) => {
    // The event.detail carries the data you dispatched.
    console.log(
      "Notified of template rundown item save via document:",
      event.detail
    );
  });
});

// Listen for the custom toggle event, and react accordingly. (NOT WORKING)
document.addEventListener("stopWatchToggle", () => {
  // FIXME: DID NOT WORK from HTML body in SplitTime.html
  console.log("stopWatchToggle event received");
  // For example, toggle the stopwatch state:
  // Note: Adjust these calls based on your stopwatch API.
  if (
    typeof stopWatch.freeze === "function" &&
    typeof stopWatch.stop === "function"
  ) {
    // If the stopwatch is running, perform toggle to other state
    if (stopWatch.getState() === "running") {
      stopWatch.freeze(10); // freeze for 10 secs, then auto-resume
      console.log("Stopwatch freezed");
    } else {
      console.log(
        "Stopwatch was not running. state was: ",
        stopWatch.getState()
      );
    }
  }
});

// Set up a listener that listens for the customSignal event. (NOT WORKING)
document.addEventListener("customSignal", function (e) {
  console.log("Custom signal received via document (1):", e.detail);
  alert("Custom event on document received (1)");
});

// Attach the listener when DOM is ready. (NOT WORKING)
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("customSignal", function (e) {
    console.log("Custom signal received via document (2):", e.detail);
    alert("Custom event on document received (2)");
  });
});

/* OK only if "globalExtras": { "customscript": "/templates/oktyr/sm2025medeldist/js/spx_interface.js" is defined in config! */
/*
window.updateFollowedRunner = function () {
  //alert("updateFollowedRunner() CALLED!");
  console.log("window.updateFollowedRunner called in spx_interface.js!");
};
*/

// Use local storage as a fallback to get 'previous' selected Runner's data
function getDataFromLocalStorage(isRadioSplit) {
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
  // Only for split time with radio controls:
  if (isRadioSplit) {
    selectedRadioSplitId = localStorage.getItem("selectedRadioSplitId");
    if (selectedRadioSplitId === null) {
      console.error("refetchRunnersData with selectedRadioSplitId === null");
      alert(
        "Refetch misslyckades! Välj klass och skriv giltigt startnummer och välj en radiokontroll!"
      );
      return false;
    }
  }

  console.log("Previous runner's data from localStorage: ");
  console.log("selectedClass: ", selectedClass);
  console.log("selectedRunnerBib: ", selectedRunnerBib);
  console.log("selectedRadioSplitId: ", selectedRadioSplitId);
  return true;
}

function getTopThreeRunners(runners) {
  // Validate that runners is an array.
  if (!Array.isArray(runners)) {
    console.error("Expected runners to be an array.");
    return [];
  }

  // Ensure that a string value like "1" and a numeric value like 1 are treated equivalently
  // Filter for runners whose place is 1, 2, or 3
  const topRunners = runners.filter((runner) =>
    [1, 2, 3].includes(Number(runner.place))
  );

  // Sort the filtered runners in ascending order by `place` 1, 2, 3
  // compare function subtracts one runner’s place from the other’s
  // Sort the filtered runners in ascending order by `place`
  topRunners.sort((a, b) => Number(a.place) - Number(b.place));

  return topRunners;
}

// OLD HARD-CODED MOCKTEST 2025-04-24:
/*
const mockData_OneRunner = {
  // 'meta-data':
  competition: "Medel-Kval",
  runner_class: "H21",
  // 'runners' data i array:
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
// UDPATED HARD-CODED MOCKTEST 2025-05-07:
const mockData_OneRunner_OneSplit = {
  // 'meta-data':
  competition: "Medel-Kval",
  runner_class: "D21",
  split: {
    id: 150,
    name: "Mock Split - Radio 2,9 km",
    runners: [
      {
        team: null,
        bib: "144",
        name: "Eva Rådberg",
        club: "OK Tyr",
        start_time: 745900,
        split_time: 753878,
        // place  // Place is MISSING HERE!
      },
    ],
  },
};

function validateApiResponseDataTypes(data) {
  if (
    typeof data.competition !== "string" ||
    typeof data.runner_class !== "string" ||
    !Array.isArray(data.runners)
  ) {
    return false;
  }

  return data.runners.every(
    (runner) =>
      typeof runner.bib === "string" && // TODO: Maybe allow number, if bib is always converted using string(bib)?
      typeof runner.name === "string" &&
      typeof runner.club === "string" &&
      typeof runner.start_time === "string" &&
      /^\d{2}:\d{2}$/.test(runner.start_time) &&
      Array.isArray(runner.split_times) &&
      runner.split_times.every((time) => Number.isInteger(time)) &&
      Number.isInteger(runner.final_time) &&
      Number.isInteger(runner.place)
  );
}

// Validator function to check that the API data has the expected structure and types.
function validateRunnerApiData(data) {
  // Check that data is an object.
  if (!data || typeof data !== "object") {
    console.error("API data is not a valid object.");
    return false;
  }

  // Check that each required property exists with the correct type.
  if (typeof data.bib !== "number") {
    console.error(
      `Invalid type for "bib": expected number, got ${typeof data.bib}`
    );
    return false;
  }

  if (typeof data.competition !== "string") {
    console.error(
      `Invalid type for "competition": expected string, got ${typeof data.competition}`
    );
    return false;
  }

  if (typeof data.name !== "string") {
    console.error(
      `Invalid type for "name": expected string, got ${typeof data.name}`
    );
    return false;
  }

  if (typeof data.runner_class !== "string") {
    console.error(
      `Invalid type for "runner_class": expected string, got ${typeof data.runner_class}`
    );
    return false;
  }

  if (typeof data.runner_club !== "string") {
    console.error(
      `Invalid type for "runner_club": expected string, got ${typeof data.runner_club}`
    );
    return false;
  }

  if (typeof data.start_time !== "number") {
    console.error(
      `Invalid type for "start_time": expected number, got ${typeof data.start_time}`
    );
    return false;
  }

  return true;
}

function validateApiResponseSplitDataTypes(data) {
  // Validate top-level meta-data.
  if (
    typeof data.competition !== "string" ||
    typeof data.runner_class !== "string" ||
    typeof data.split !== "object" ||
    data.split === null
  ) {
    return false;
  }

  // Validate split-level properties.
  if (
    typeof data.split.id !== "number" ||
    typeof data.split.name !== "string" ||
    !Array.isArray(data.split.runners)
  ) {
    return false;
  }

  // Validate each runner in the runners array.
  return data.split.runners.every((runner) => {
    // Check for core runner properties.
    if (
      typeof runner.bib !== "string" ||
      typeof runner.name !== "string" ||
      typeof runner.club !== "string" ||
      typeof runner.start_time !== "number" ||
      typeof runner.split_time !== "number"
    ) {
      return false;
    }

    // Validate team can be either null or a string.
    if (runner.team !== null && typeof runner.team !== "string") {
      return false;
    }
    return true;
  });
}

/**
 * Given API data with a runners array, [the selected class], and a selected bib,
 * return the runner object that has that bib.
 *
 * @param {Object} apiData - The data returned from the API.
 * @param {string} valdKlass - The class value (e.g., "D21" or "H21").
 * @param {string|number} valdBib - The bib value to look for.
 * @returns {Object|null} The runner object if found; otherwise, null.
 */
function findSpecificRunner(apiData, valdKlass, valdBib) {
  // Ensure that the API data exists and has runners
  if (!apiData || !apiData.runners) {
    console.error("No runners found in API data.");
    alert("Inga löpardata från API endpoint.");
    return null;
  }

  // Allow ALL classes as long as bib number matches!!!

  // Find the runner with a bib that matches valdBib.
  // Converting both values to strings can help when one is a string vs. number.
  const runner = apiData.runners.find(
    (runner) => String(runner.bib) === String(valdBib)
  );

  if (!runner) {
    console.error(`No runner found with bib ${valdBib}.`);
    alert("Startnumret " + valdBib + " hittades inte i löpardatat.");
    return null;
  }

  return runner;
}

/**
 * Given API data with a split object containing a runners array, and a selected bib,
 * return the runner object that has that bib.
 *
 * @param {*} apiSplitData
 * @param {*} valdBib
 * @returns {Object|null} The runner object if found; otherwise, null.
 */
function findSpecificRunnerFromSplit(apiSplitData, valdBib) {
  // Verify that the API data exists and that there is a split with a runners array.
  if (
    !apiSplitData ||
    !apiSplitData.split ||
    !Array.isArray(apiSplitData.split.runners)
  ) {
    console.error("No runners found in API data.");
    alert("Inga löpardata från API endpoint.");
    return null;
  }

  // Find the runner with a bib that matches valdBib.
  // Converting both values to strings ensures that numbers and string representations match.
  const runner = apiSplitData.split.runners.find(
    (runner) => String(runner.bib) === String(valdBib)
  );

  if (!runner) {
    console.error(`No runner found with bib ${valdBib}.`);
    alert("Startnumret " + valdBib + " hittades inte i löpardatat.");
    return null;
  }

  return runner;
}

/**
 * Main update function that performs common preparation work and then,
 * based on the templateType, calls the related runUpdateTemplate function.
 */
function update(data) {
  var templateData = JSON.parse(data);
  console.log("----- Update handler called with data:", templateData);

  //console.log("----- Vald runner_class: ", templateData.f_vald_klass);
  //console.log("----- Vald runner bib: ", templateData.f_vald_runner_bib);

  selectedClass = templateData.f_vald_klass;
  selectedRunnerBib = templateData.f_vald_runner_bib;

  // Save persistently?
  if (selectedClass) {
    localStorage.setItem("selectedClass", selectedClass);
    //console.log("Class saved: ", selectedClass);
  }
  if (selectedRunnerBib) {
    localStorage.setItem("selectedRunnerBib", selectedRunnerBib);
    //console.log("BibNr saved", selectedRunnerBib);
  }

  // templateType - Expected values "split", "lower3rd", or "other".
  templateType = (templateData.fTemplateType || "other").toLowerCase();
  console.log("----- Update templateType:", templateType);

  // Decide which template update function to call based on the provided type.
  // The default case will also catch scenarios where templateType might not be defined.
  switch (templateType) {
    case "split":
      // TODO: RadioSplitId EX: 100, 200, 300, 400 = (TV1, TV2, TV3, MÅL)
      selectedRadioSplitId = templateData.f_vald_kontroll;
      console.warn(typeof selectedRadioSplitId); // string!

      localStorage.setItem(
        "selectedRadioSplitId",
        Number(selectedRadioSplitId)
      );

      // 2025-05-08: FIXME: UPDATE FOR PRODUCTION!
      //  fetchRunnersSplit(selectedClass, Number(selectedRadioSplitId))
      fetchRunnersSplit(3, 150)
        .then((apiData) => {
          // Validate that API data exists.
          if (
            !apiData ||
            !apiData.split ||
            !Array.isArray(apiData.split.runners) ||
            apiData.split.runners.length === 0
          ) {
            // FIXME: 2025-05-08:
            console.warn("No API data or split with runners array available!");
            alert(
              "Fetch från API misslyckades!\nVälj klass och startnummer\nFörsök sedan på nytt!"
            );
            return;
          }
          console.log("API Split Response:", apiData);
          console.log("with: " + apiData.split.runners.length + " runners.");

          // Optionally validate the API data types.
          console.log(
            "validateApiResponseSplitDataTypes:",
            validateApiResponseSplitDataTypes(apiData)
          );

          // Find the specific runner using your existing function.
          let selectedRunner = findSpecificRunnerFromSplit(
            apiData,
            //selectedClass, // Allow all classes, as long as bib matches
            selectedRunnerBib
          );
          if (!selectedRunner) {
            // alerts visas redan från findSpecificRunner funktionen!
            console.error(
              "Specific runner with bib: " +
                selectedRunnerBib +
                " was not found."
            );
            // Continue processing to try retrieve and update leader and top runners.
          } else {
            console.log("Specific runner:", selectedRunner);
            //console.log("typeof selectedRunner: ", typeof selectedRunner); //object
            // 2025-05-06:
            localStorage.setItem("selectedRunnerBib", selectedRunner.bib);
            localStorage.setItem("selectedRunnerName", selectedRunner.name);
            localStorage.setItem("selectedRunnerClub", selectedRunner.club);
            localStorage.setItem(
              "selectedRunnerObject",
              JSON.stringify(selectedRunner)
            );
          }

          // NOTE: Now assuming that 'place' exists for sorting purposes!
          // Retrieve the leader runner (runner with place === 1).
          const leaderRunner = apiData.split.runners.find(
            (runner) => runner.place === 1
          );
          if (leaderRunner) {
            console.log("Leader Runner:", leaderRunner);
          } else {
            console.error("No runner with place === 1 found.");
          }

          // Get the top three runners from the split runners array.
          const topThreeRunners = getTopThreeRunners(apiData.split.runners);
          console.log("Top-3 Runners:", topThreeRunners);
          if (!topThreeRunners || topThreeRunners.length !== 3) {
            console.warn("No top 3-runners with place 1,2,3 found.");
          }

          // BUG 0507 #2: Om ingen löpare hittades (fel klass var vald)
          // FIX: Visa föregående vald löpare!
          // VERIFIED 0507
          if (!selectedRunner) {
            console.error("NOT selectedRunner");
            // Tillfällig för debug:
            selectedRunner = JSON.parse(
              localStorage.getItem("selectedRunnerObject")
            );

            const userConfirmed = confirm(
              "Vill du visa föregående löpare med nr?: " +
                localStorage.getItem(selectedRunnerBib)
            );
            if (userConfirmed) {
              console.log("The user answered: YES");
              console.log(
                "Using previously saved selectedRunner:",
                selectedRunner
              );
            } else {
              console.log(
                "User declined, not using the previous selectedRunner."
              );
              // You could clear selectedRunner if needed:
              selectedRunner = null;
            }
          }

          // Update any DOM elements associated with our template data fields
          // FIXME: Might not work correctly for SPLIT template type???
          updateTemplateDataFields(templateData, selectedRunner); // UPDATED 2025-05-04 17:30 -> 'VERIFIED' 05-05!
          // FIXME: Could I even SKIP this, if it does not change anything shown in editor?

          if (typeof runSplitTemplateUpdate === "function") {
            // This triggers the graphic overlay update
            runSplitTemplateUpdate(
              selectedRunner, // MOST IMPORTANT
              leaderRunner, // MORE IMPORTANT than topThree
              topThreeRunners // LESS important (might be less than 3 objects)
            );
          } else {
            console.warn(
              "runSplitTemplateUpdate() function missing from SPX template."
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching API response:", error);
        });

      // Exit the update() function after handling the asynchronous call.
      // NOTE: Code immediately after .then(…) call will run synchronously after the promise is set up,
      //  it will not wait for the promise to resolve.
      return;
      break;

    case "lower3rd":
      /*
        INGEN split-tid!!! INGA radio-kontroller!
        ENDAST aktuell running time i stopWatch komponenten!
        Jag behöver egentligen INTE anropa API endpoint för detta!
        Utan jag skulle kunna plocka info från startlist datat (som fallback)!!!
      */
      // 2025-05-07: UPDATED FOR PRODUCTION
      fetchSpecificRunnerData(selectedClass, selectedRunnerBib)
        .then((apiData) => {
          console.log("Specific Runner Data:", apiData);

          // Validate the API data.
          if (!validateRunnerApiData(apiData)) {
            alert(
              "Fetch från API misslyckades!\nVälj klass och startnummer\nFörsök sedan på nytt!"
            );
            console.warn(
              "Specific runner with bib: " +
                selectedRunnerBib +
                " was not found."
            );
            return; //################## RETURN !!!
          }

          console.log("API data has valid structure and data types.");

          // Further processing of valid apiData can go here.
          localStorage.setItem("selectedRunnerName", apiData.name);
          // Update any DOM elements associated with our template data fields
          updateTemplateDataFields(templateData, apiData);

          if (typeof runTemplateUpdate === "function") {
            // This triggers the graphic overlay update
            runTemplateUpdate(apiData, templateData);
          } else {
            console.error(
              "runTemplateUpdate() function missing from SPX template."
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching API response:", error);
        });

      // Exit the update() function after handling the asynchronous call.
      // NOTE: Code immediately after .then(…) call will run synchronously after the promise is set up,
      //  it will not wait for the promise to resolve.
      return;
      break;

    default:
      // For all other cases or when templateType is unspecified.

      // TODO:
      console.warn("OTHER CASE for other templateType: ", templateType);

      if (typeof runTemplateUpdate === "function") {
        // This triggers the graphic overlay update
        runTemplateUpdate();
      } else {
        console.error(
          "runTemplateUpdate() function missing from SPX template."
        );
      }
      break;
  }
}

// Start the recursive periodical timer, as long as graphic overlay is playing:
if (shouldRunToggleTimerTask) runToggleTimerTaskPeriodically();

// Receive item data from SPX Graphics Controller
// and store values in hidden DOM elements for
// use in the template.

// Play handler
function play() {
  //console.log("----- Play handler called.");

  if (templateType === "split" && !shouldRunToggleTimerTask) {
    shouldRunToggleTimerTask = true; // start the periodic task
    runToggleTimerTaskPeriodically(); // UPDATE 2025-05-07
    console.log("STARTED runToggleTimerTaskPeriodically");
  }

  if (typeof runAnimationIN === "function") {
    runAnimationIN();
  } else {
    console.error("runAnimationIN() function missing from SPX template.");
  }
}

// Stop handler
function stop() {
  //console.log("----- Stop handler called.");

  if (templateType === "split") {
    // stop the periodic task
    shouldRunToggleTimerTask = false;
    console.log("STOPPED runToggleTimerTaskPeriodically");
  }

  if (typeof runAnimationOUT === "function") {
    runAnimationOUT();
  } else {
    console.error("runAnimationOUT() function missing from SPX template.");
  }
}

// Continue handler
function next(data) {
  console.log("----- Next handler called.");

  // Check if templateType is SPLIT (or LOWER3RD)?
  // If it is, then use CONTINUE as a fallback for PAUSE of TIME!

  if (templateType === "split" && stopWatch) {
    pauseStopWatch(10);
  }

  // Else we will need to use CONTINUE for pagination of start and result lists!

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

function getAllEls(classSpecifierName) {
  if (!classSpecifierName) {
    console.warn("Element class specifier name is falsy, returning null.");
    return null;
  }
  var elemsArr = document.getElementsByClassName(classSpecifierName);
  if (!elemsArr || elemsArr.length < 1) {
    console.warn(
      "Elements with class name " +
        classSpecifierName +
        " not found, returning null."
    );
    return null;
  }
  return elemsArr;
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

// ---------------------------------------------------------------------------------
/*
  Extra functions:
    Added extra button in rundown config
    Required in SPX template:
      field: "f_pause_stopwatch_btn",
      ftype: "button",
      fcall: "pauseStopWatch()" 
*/
// ---------------------------------------------------------------------------------
/* MOVED TO TOP OF spx_interface
function pauseStopWatch(timeInSeconds) {
  if (stopWatch) {
    stopWatch.freeze(timeInSeconds);
    console.log("Stopwatch freezed for " + timeInSeconds + " seconds.");
  }
}
*/
function updateTemplateDataFields(currTemplateData, currRunnerFromAPI) {
  // If you want to override values for f0, f1, and f2, you can define an object to map the new values:
  const fieldOverrides = {
    f0: currRunnerFromAPI.bib, // for example replace "9999" with "444"
    f1: currRunnerFromAPI.name,
    f2: currRunnerFromAPI.club,
  };

  // Find an element in the DOM with an id matching the key
  // Loop through each field in the currtemplateData object
  for (var dataField in currTemplateData) {
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
        idField.innerText = currTemplateData[dataField];
      }
    } else {
      switch (dataField) {
        case "comment":
        case "epochID":
          //console.debug("FYI: Optional #" + dataField + " missing from SPX template...");
          break;
        case "fTemplateType":
          console.warn(
            "WARN: Recommended #" + dataField + " missing from SPX template..."
          );
          break;
        default:
          console.error(
            "ERROR: Placeholder #" + dataField + " missing from SPX template."
          );
      }
    }
  } //end for
}

// ----------------------------------------------------------------------------------
/*
  PRODUCTION: Send API request and receive response
*/
// ----------------------------------------------------------------------------------

// Wrapper function that fetches and validates the API response using async/await.
/* NOT NEEDED (it was just for fun)
async function fetchApiResponseSingleAsync() {
  try {
    const apiData = await fetchSpecificRunnerData("HD21-TEST", 102);
    console.log("Specific Runner Data:", apiData);

    // Validate the structure and data types of the API response.
    if (!validateRunnerApiData(apiData)) {
      throw new Error("API data validation failed.");
    }

    // If we reach this point, the API data is valid.
    console.log("API data has valid structure and data types.");

    // Further processing can be done here...
    // For example, update your UI or store the data for later use.
  } catch (error) {
    console.error("Error fetching API response:", error);
  }
}
*/

/**
 * Fetches API data for many runners for a specified split
 *
 * The endpoint URL is built as:
 *   http://85.24.189.92:5000/api/{competition}/{runnerClass}/splits/{splitID}
 *
 * For now, competition is hard-coded as 10.
 *
 * @param {string|number} runnerClass - The class parameter for the API. (e.g., "3")
 * @param {string|number} splitID - The identification number for the split (radio control).
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 * @throws {Error} if the fetch fails or the status is not OK.
 */
async function fetchRunnersSplit(runnerClass, splitID) {
  // FIXME: Hard-coded keys (TEST SITE: http://85.24.189.92:5000/api/10/3/splits/150)
  const competition = 10; // FIXME: Verify that ID 1 -> MedelDistans Final SM2025

  const url = `http://85.24.189.92:5000/api/${competition}/${runnerClass}/splits/${splitID}`;
  console.log("Fetching data from URL:", url);

  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      let friendlyMessage;
      switch (response.status) {
        case 404:
          friendlyMessage =
            "The requested data was not found. Please check your selection and try again.";
          break;

        case 500:
          friendlyMessage =
            "Our server encountered an error. Please try again later or contact support.";
          break;
        default:
          friendlyMessage = `An unexpected error occurred (Error code: ${response.status}). Please try again.`;
      }
      alert(friendlyMessage);
      // Throw a new error with this operator-friendly message.
      throw new Error(friendlyMessage);
    }
    // Parse JSON data from the response.
    const apiData = await response.json();
    return apiData;
  } catch (error) {
    console.error("Error fetching API data:", error);
    // When the fetch fails in a network-related way (e.g., connection timeout),
    // the error message commonly is "Failed to fetch". In that case, provide a friendly message.
    let friendlyMessage = "";
    if (error.message.indexOf("Failed to fetch") !== -1) {
      friendlyMessage =
        "Network error: The server could not be reached. Please check your connection and try again.";
    } else {
      friendlyMessage =
        error.message || "An unknown error occurred. Please try again.";
    }
    alert(friendlyMessage);
    throw error;
  }
}

// This periodic task shall run every second as long as the graphic overlay is playing!
function runToggleTimerTaskPeriodically() {
  if (!shouldRunToggleTimerTask) {
    console.log(
      "Periodic ToggleTimer task has been stopped; no further tasks."
    );
    return; // Stop further execution if the flag is false.
  }

  // Perform the task if the flag is set
  if (doFreezeTimerOnce) {
    // We shall try to freeze the timer only if it currently is running!
    if (stopWatch && stopWatch.getState() === "running") {
      stopWatch.freeze(10);
      console.log("Stopwatch freezed for 10 seconds.");
    }
    doFreezeTimerOnce = false;
  }

  // Schedule the next run:
  setTimeout(runToggleTimerTaskPeriodically, 1000);
}

// Function to stop the periodic task: (will always be stopped at stop() call when graphic overlay is stopped)
function stopToggleTimerTask() {
  shouldRunToggleTimerTask = false;
  console.log(
    "Periodic ToggleTimer task was stopped via call of stopToggleTimerTask()."
  );
}

/* OK only if "globalExtras": { "customscript": "/templates/oktyr/sm2025medeldist/js/spx_interface.js" is defined in config! */
/*
window.updateFollowedRunner = function () {
  //alert("updateFollowedRunner() CALLED!");
  console.log("window.updateFollowedRunner called in spx_interface.js!");
};
*/
// ----------------------------------------------------------------------------------
//  StopWatch Toggling
//
// Requires:
//  "globalExtras": { "customscript": "/templates/oktyr/sm2025medeldist/js/spx_interface.js" is defined in config!
// ----------------------------------------------------------------------------------

function toggle_time() {
  //alert("OK Tyr custom function toggle_time");
  console.log(
    "OK Tyr globalExtras custom function toggle_time CALLED in spx_interface.js.\n"
  );

  // pauseStopWatch(10);

  if (stopWatch) {
    stopWatch.freeze(10);
    console.log("Stopwatch freezed for 10 seconds.");
  }
}

// ----------------------------------------------------------------------------------
//  StopWatch Freeze
//
// Requires:
//  showExtras: { CustomControls: ... IN templates DataFields!
// AND:
//  Adding Project Extras via UI with path to .../js/spx_interface.js
// ----------------------------------------------------------------------------------

function freeze_time() {
  //alert("OK Tyr custom function toggle_time");
  console.log(
    "OK Tyr Project showExtras custom function freeze_time CALLED in spx_interface.js.\n"
  );

  if (!doFreezeTimerOnce) {
    doFreezeTimerOnce = true;
    //shouldRunToggleTimerTask = true;
  }
}

function freezeStopWatchInstance(sw) {
  if (typeof sw.freeze === "function" && typeof sw.stop === "function") {
    // If the stopwatch is running, perform toggle to other state
    if (sw.getState() === "running") {
      sw.freeze(10); // freeze for 10 secs, then auto-resume
      console.log("Stopwatch freezed");
    } else {
      console.log("Stopwatch was not running. state was: ", sw.getState());
    }
  }
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

// ----------------------------------------------------------------------------------

// MOCKTEST: Mock function to simulate the API response
/*
  An async function always returns a Promise, regardless of whether you use await inside the function or not.
*/

// MOCKTEST for lowerThird and follow runner with bibnr:
async function fetchMockApiResponse(_klass, bibnr) {
  // Simulated delay (like a real API call)
  await new Promise((resolve) => setTimeout(resolve, 200));

  // MOCKTEST responding with one runner to follow
  if (bibnr === "444") {
    return {
      competition: "Medel-Kval",
      runner_class: "H21",
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
      runner_class: "H21",
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
  } else if (bibnr === "1") {
    return {
      competition: "Medel-Kval",
      runner_class: "H21",
      runners: [
        {
          bib: "1",
          name: "Anders Andersson",
          club: "OK Test A",
          start_time: "14:40",
          split_times: [2850, 5280, 7940],
          final_time: 10800,
          place: 3,
        },
      ],
    };
  } else if (bibnr === "2") {
    return {
      competition: "Medel-Kval",
      runner_class: "H21",
      runners: [
        {
          bib: "2",
          name: "Bertil Barthelsson",
          club: "OK Test B",
          start_time: "14:42",
          split_times: [3450, 6080, 9240],
          final_time: 10800,
          place: 2,
        },
      ],
    };
  } else if (bibnr === "3") {
    return {
      competition: "Medel-Kval",
      runner_class: "H21",
      runners: [
        {
          bib: "3",
          name: "Cesar Coreliusson",
          club: "OK Test C",
          start_time: "14:44",
          split_times: [1450, 3080, 4840],
          final_time: 10800,
          place: 1,
        },
      ],
    };
  } else if (bibnr === "111") {
    return {
      competition: "Medel-Kval",
      runner_class: "D21",
      runners: [
        {
          bib: "111",
          name: "Anna Andersson",
          club: "OK Tyr",
          start_time: "12:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 1,
        },
      ],
    };
  } else if (bibnr === "222") {
    return {
      competition: "Medel-Kval",
      runner_class: "D21",
      runners: [
        {
          bib: "222",
          name: "Lisa Bergström",
          club: "IFK Göteborg",
          start_time: "12:02",
          split_times: [2520, 5190, 7950],
          final_time: 10950,
          place: 2,
        },
      ],
    };
  } else if (bibnr === "333") {
    return {
      competition: "Medel-Kval",
      runner_class: "D21",
      runners: [
        {
          bib: "333",
          name: "Karin Johansson",
          club: "OK Djerf",
          start_time: "12:04",
          split_times: [2580, 5300, 8080],
          final_time: 11200,
          place: 3,
        },
      ],
    };
  } else if (bibnr === "444") {
    return {
      competition: "Medel-Kval",
      runner_class: "D21",
      runners: [
        {
          bib: "444",
          name: "Ferdina Fyrisdottir",
          club: "OK Fyran",
          start_time: "12:04",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 4,
        },
      ],
    };
  } else if (bibnr === "555") {
    return {
      competition: "Medel-Kval",
      runner_class: "D21",
      runners: [
        {
          bib: "555",
          name: "Hanna Helenius",
          club: "OK Tyr",
          start_time: "12:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 5,
        },
      ],
    };
  } else if (bibnr === "777") {
    // HAVE TESTED here WITHOUT 'meta-data'!: which is not expected to work since we expect FULL API data here!
    return {
      competition: "Medel-Kval",
      runner_class: "D21",
      runners: [
        {
          bib: "777",
          name: "Susanna Negative Test Case",
          club: "OK Negativt Test",
          start_time: "12:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 1,
        },
      ],
    };
  }
  console.log("Returning null from fetchMockApiResponse");
  return null; // Explicitly return null if no match, else undefined would be returned
}

//
// MOCKDATA for split data
//

// First mock data object
const apiMockSplitData1 = {
  competition: "Mock Competition Beta",
  runner_class: "D21",
  split: {
    id: 150,
    name: "Mock Split - TV1",
    runners: [
      {
        team: "Squad X",
        bib: "101",
        name: "Alice Smith",
        club: "OK Sprinters",
        start_time: 45800,
        split_time: 53800,
        place: 1,
      },
      {
        team: "Team Bravo",
        bib: "102",
        name: "Bernadette Brown",
        club: "OK Runners",
        start_time: 45820,
        split_time: 58820,
        place: 3,
      },
      {
        team: "Team Ski",
        bib: "103",
        name: "Johanna Hagström",
        club: "OK Göteborg",
        start_time: 55820,
        split_time: 63820,
        place: 2,
      },
      {
        team: null,
        bib: "111",
        name: "Anna-Lisa Carlsson",
        club: "IFK Sunne",
        start_time: 56730,
        split_time: 76540,
        place: 4,
      },
    ],
  },
};

const apiMockSplitData2 = {
  competition: "Mock Competition Alpha",
  runner_class: "H21",
  split: {
    id: 150,
    name: "Mock Split - TV1",
    runners: [
      {
        team: null,
        bib: "201",
        name: "Melwin Lyckesol",
        club: "IF Höppera",
        start_time: 39050,
        split_time: 53878,
        place: 1,
      },
      {
        team: null,
        bib: "202",
        name: "Emil Rådberg",
        club: "OK Tyr",
        start_time: 25900,
        split_time: 33878,
        place: 4,
      },
      {
        team: null,
        bib: "203",
        name: "Charlie Chaplin",
        club: "OK Comedy Club",
        start_time: 75930,
        split_time: 73910,
        place: 3,
      },
      {
        team: null,
        bib: "222",
        name: "John Doe",
        club: "OK Thunder",
        start_time: 1930,
        split_time: 3910,
        place: 2,
      },
    ],
  },
};

const apiMockSplitData3 = {
  competition: "Mock Competition Gamma",
  runner_class: "H21",
  split: {
    id: 150,
    name: "Mock Split - Trail Run",
    runners: [
      {
        team: null,
        bib: "301",
        name: "Charlie Day",
        club: "OK Trailblazers",
        start_time: 745700,
        split_time: 753700,
      },
      {
        team: "Team Charlie",
        bib: "302",
        name: "Dana White",
        club: "OK Fast",
        start_time: 745710,
        split_time: 753710,
      },
    ],
  },
};

// UPDATED MOCKTEST for splitTime:
async function fetchMockApiResponseMany(_klass) {
  // MOCKTEST responding with several runners in a specific class (D21 or H21)
  // UPDATED WITH:
  // Including current place on current or last passed (?) split during competition.
  // Also including split times for all radio split controls.
  if (_klass === "D21") {
    // Mock data
    return apiMockSplitData1;
  } else if (_klass === "H21") {
    return apiMockSplitData2;
  } else {
    return apiMockSplitData3;
  }
}

// -------------------------------------- MOCK DATA END

console.log("!!!! Now spx_interface.js script has FINISHED !!!!");
