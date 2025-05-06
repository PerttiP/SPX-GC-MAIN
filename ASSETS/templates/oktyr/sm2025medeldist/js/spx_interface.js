// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025 (medeldist)

let selectedClass;
let selectedRunnerBib;
let selectedRadioSplitId;
//let validRunnerSelectedInUI = true;

let templateType; // "LowerThird" or "Split" or "Other"

let stopWatch;

console.log("!!!! NOTE: This spx_interface.js script MUST EXECUTE FIRST !!!!");

document.addEventListener("DOMContentLoaded", function () {
  console.log("!!!! DOM content loaded (spx_interface) !!!! ");

  // Set up a listener for event dispatched from spx_gc.js: (NOT WORKING)
  // Listen for the custom "templateRundownItemSaved" event on window.
  window.addEventListener("templateRundownItemSaved", (event) => {
    // The event.detail carries the data you dispatched.
    console.log("Notified of template rundown item save:", event.detail);
  });
});

// Listen for the custom toggle event, and react accordingly.
window.addEventListener("stopWatchToggle", () => {
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

/* OK only if "globalExtras": { "customscript": "/templates/oktyr/sm2025medeldist/js/spx_interface.js" is defined in config! */
/*
window.updateFollowedRunner = function () {
  //alert("updateFollowedRunner() CALLED!");
  console.log("window.updateFollowedRunner called in spx_interface.js!");
};
*/

// TODO: Could we use local storage as a fallback to get 'previous' selected Runner's data?
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
    if (selectedRadioSplitId === null) {
      console.error("refetchRunnersData with selectedRadioSplitId === null");
      alert(
        "Refetch misslyckades! Välj klass och skriv giltigt startnummer och välj en radiokontroll!"
      );
      return false;
    }
  }

  console.log("selectedClass: ", selectedClass);
  console.log("selectedRunnerBib: ", selectedRunnerBib);
  console.log("selectedRadioSplitId: ", selectedRadioSplitId);
  return true;
}

function getTopThreeRunners(runners) {
  // Filter for runners whose place is 1, 2, or 3
  const topRunners = runners.filter((runner) =>
    [1, 2, 3].includes(runner.place)
  );

  // Sort the filtered runners in ascending order by `place` 1, 2, 3
  topRunners.sort((a, b) => a.place - b.place); // compare function subtracts one runner’s place from the other’s

  return topRunners;
}

// HARD-CODED MOCKTEST 2025-04-24:
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
  // If you also want to check that the overall API data has the correct class,
  // you can uncomment the following:
  /*
  if (apiData.runner_class !== valdKlass) {
    console.warn("API data class does not match the selected class.");
    alert("Startnumret " + valdBib + " hittades inte för vald klass.");
    return null;
  }
  */

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
 * Main update function that performs common preparation work and then,
 * based on the templateType, calls the related runUpdateTemplate function.
 */
function update(data) {
  var templateData = JSON.parse(data);
  console.log("----- Update handler called with data:", templateData);

  console.log("----- Vald runner_class: ", templateData.f_vald_klass);
  console.log("----- Vald runner bib: ", templateData.f_vald_runner_bib);

  selectedClass = templateData.f_vald_klass;
  selectedRunnerBib = templateData.f_vald_runner_bib;

  // Save persistently?
  if (selectedClass) {
    localStorage.setItem("selectedClass", selectedClass);
    console.log("Class saved: ", selectedClass);
  }
  if (selectedRunnerBib) {
    localStorage.setItem("selectedRunnerBib", selectedRunnerBib);
    console.log("BibNr saved", selectedRunnerBib);
  }

  // templateType - Expected values "split", "lower3rd", or "other".
  const templateType = (templateData.fTemplateType || "other").toLowerCase();
  console.log("----- Update templateType:", templateType);

  // Decide which template update function to call based on the provided type.
  // The default case will also catch scenarios where templateType might not be defined.
  switch (templateType) {
    case "split":
      // When using mock data for testing, call the mock API.
      fetchMockApiResponseMany(selectedClass)
        .then((apiData) => {
          // Validate that API data exists.
          if (!apiData || !apiData.runners || apiData.runners.length === 0) {
            console.warn("No API data or runners available!");
            alert(
              "Fetch från API misslyckades!\nVälj klass och startnummer\nFörsök sedan på nytt!"
            );
            return;
          }
          console.log("Mock API Response:", apiData);
          console.log("with: " + apiData.runners.length + " runners.");

          // Optionally validate the API data types.
          console.log(
            "validateApiResponseDataTypes:",
            validateApiResponseDataTypes(apiData)
          );

          // Find the specific runner using your existing function.
          const selectedRunner = findSpecificRunner(
            apiData,
            selectedClass,
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
            console.log(typeof selectedRunner);
          }

          // Retrieve the leader runner (runner with place === 1).
          const leaderRunner = apiData.runners.find(
            (runner) => runner.place === 1
          );
          if (leaderRunner) {
            console.log("Leader Runner:", leaderRunner);
          } else {
            console.error("No runner with place === 1 found.");
          }

          // Get the top three runners from the array.
          const topThreeRunners = getTopThreeRunners(apiData.runners);
          console.log("Top-3 Runners:", topThreeRunners);
          if (!topThreeRunners || topThreeRunners.length !== 3) {
            console.warn("No top 3-runners with place 1,2,3 found.");
          }

          // Update any DOM elements associated with our template data fields
          // FIXME: Might not work correctly for SPLIT template type???
          updateTemplateDataFields(templateData, selectedRunner); // UPDATED 2025-05-04 17:30 -> VERIFY IT!

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
          console.error("Error fetching mock API response:", error);
        });

      // Exit the update() function after handling the asynchronous call.
      // NOTE: Code immediately after .then(…) call will run synchronously after the promise is set up,
      //  it will not wait for the promise to resolve.
      return;
      break;

    case "lower3rd":
      // MOCKTEST for LowerThird: Simulate an API response (will return Mock data for bib id)!
      fetchMockApiResponse(selectedClass, selectedRunnerBib)
        .then((apiData) => {
          // Validate that API data exists.
          if (!apiData || !apiData.runners || apiData.runners.length === 0) {
            console.warn("No API data or runners available!");
            alert(
              "Fetch från API misslyckades!\nVälj klass och startnummer\nFörsök sedan på nytt!"
            );
            return;
          }
          console.log("Mock API Response:", apiData);
          console.log("with: " + apiData.runners.length + " runners.");

          // Optionally validate the API data types.
          console.log(
            "validateApiResponseDataTypes:",
            validateApiResponseDataTypes(apiData)
          );

          const selectedRunner = findSpecificRunner(
            apiData,
            selectedClass,
            selectedRunnerBib
          );

          if (!selectedRunner) {
            // alerts visas redan från findSpecificRunner funktionen!
            console.warn(
              "Specific runner with bib: " +
                selectedRunnerBib +
                " was not found."
            );

            return; //################## RETURN !!!
          } else {
            console.log("Specific runner: ", selectedRunner);
          }

          // Update any DOM elements associated with our template data fields
          updateTemplateDataFields(templateData, selectedRunner); // UPDATED 2025-05-04 17:30 -> VERIFY IT!

          if (typeof runTemplateUpdate === "function") {
            // This triggers the graphic overlay update
            runTemplateUpdate(selectedRunner, templateData);
          } else {
            console.error(
              "runTemplateUpdate() function missing from SPX template."
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching mock API response:", error);
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

// Receive item data from SPX Graphics Controller
// and store values in hidden DOM elements for
// use in the template.

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

  // Check if templateType is SPLIT or LOWER3RD
  // If it is, then use CONTINUE as a fallback for PAUSE of TIME!

  if (templateType !== "other" && stopWatch) {
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

function pauseStopWatch(timeInSeconds) {
  alert("pauseStopWatch() CALLED!"); //

  if (stopWatch) {
    stopWatch.freeze(timeInSeconds);
    console.log("Stopwatch freezed for " + timeInSeconds + " seconds.");
    /*
    setTimeout(function () {
      stopWatch.resume();
      console.log("Stopwatch resumed after pause of 10 seconds.");
    }, 10000);
    */
  }
}

function updateTemplateDataFields(currTemplateData, currRunnerFromAPI) {
  // If you want to override values for f0, f1, and f2, you can define an object to map the new values:
  const fieldOverrides = {
    f0: currRunnerFromAPI.bib, // for example replace "9999" with "444"
    f1: currRunnerFromAPI.name,
    f2: currRunnerFromAPI.club,
  };

  // Find an element in the DOM with an id matching the key
  // Loop through each field in the _templateData object
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
            "WARN: Optional #" + dataField + " missing from SPX template..."
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
async function fetchApiResponseMany(_klass) {
  return "NOT DONE YET";
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
async function fetchMockApiResponseMany(_klass) {
  // MOCKTEST responding with several runners in a specific class (D21 or H21)
  // Including current place on current or last passed (?) split during competition.
  // Also including split times for all radio split controls.
  if (_klass === "D21") {
    // Mock data
    return {
      competition: "Medel-Kval",
      runner_class: "D21",
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
        {
          bib: "101",
          name: "Zerafina Pekkala",
          club: "OK Nåjd",
          start_time: "11:00",
          split_times: [24500, 50800, 78400],
          final_time: 108000,
          place: 12,
        },
        {
          bib: "102",
          name: "Linda Fahlin",
          club: "OK Tyr",
          start_time: "11:30",
          split_times: [21500, 30800, 58400],
          final_time: 10800,
          place: 7,
        },
        {
          bib: "111",
          name: "Anna Andersson",
          club: "OK Tyr",
          start_time: "12:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 1,
        },
        {
          bib: "333",
          name: "Karin Johansson",
          club: "OK Djerf",
          start_time: "12:04",
          split_times: [2580, 5300, 8080],
          final_time: 11200,
          place: 3,
        },
        {
          bib: "444",
          name: "Ferdina Fyrisdottir",
          club: "OK Fyran",
          start_time: "12:04",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 4,
        },
        {
          bib: "222",
          name: "Lisa Bergström",
          club: "IFK Göteborg",
          start_time: "12:02",
          split_times: [2520, 5190, 7950],
          final_time: 10950,
          place: 2,
        },
        {
          bib: "555",
          name: "Hanna Helenius",
          club: "OK Tyr",
          start_time: "12:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 5,
        },
        {
          bib: "777",
          name: "Susanna Osborne",
          club: "OK Bat",
          start_time: "12:00",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 6,
        },
      ],
    };
  } else if (_klass === "H21") {
    // Mock data
    return {
      competition: "Medel-Kval",
      runner_class: "H21",
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
        {
          bib: "444",
          name: "Ferry Fyråsen",
          club: "OK Fyran",
          start_time: "14:44",
          split_times: [2450, 5080, 7840],
          final_time: 10800,
          place: 4,
        },
        {
          bib: "555",
          name: "Pelle Pettersson",
          club: "OK Hällefors",
          start_time: "16:46",
          split_times: [12450, 35080, 53840],
          final_time: 60800,
          place: 5,
        },
      ],
    };
  }
}

// -------------------------------------- MOCK DATA END

console.log("!!!! Now spx_interface.js script has FINISHED !!!!");
