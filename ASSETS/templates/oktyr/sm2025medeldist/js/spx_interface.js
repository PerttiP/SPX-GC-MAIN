// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025.

// Mock function to simulate the API response
async function fetchMockApiResponse() {
  // Simulated delay (like a real API call)
  await new Promise((resolve) => setTimeout(resolve, 500));

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
}

function refetchRunnersData() {
  //alert("refetchRunnersData() CALLED!"); // OK!

  selectedClass = localStorage.getItem("selectedClass");

  if (selectedClass === null) {
    console.error("refetchRunnersData with selectedClass === null");
    alert("Refetch misslyckades!");
    return;
  }
  // TODO: API request

  // TODO: Simulate a API response?
  // Example usage
  fetchMockApiResponse().then((mockData) => {
    console.log("Mock API Response:", mockData);
  });
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

  if (typeof runTemplateUpdate === "function") {
    runTemplateUpdate(); // Play will follow
  } else {
    console.error("runTemplateUpdate() function missing from SPX template.");
  }
}

// Play handler
function play() {
  // console.log('----- Play handler called.')
  // if (typeof runAnimationIN === "function") {
  //   runAnimationIN()
  // } else {
  //   console.error('runAnimationIN() function missing from SPX template.')
  // }
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
