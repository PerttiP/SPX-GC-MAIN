/*
Global Scope: 
Without modules, the functions defined in fetchRunnersData.js will be available globally.

"Global" variables, outside of any functions or event handlers.
These initialization variables are only executed once when the web page is loaded.
*/

/*
FOR REAL PRODUCTION: 

Used by ASSETS\templates\oktyr\sm2025medeldist\resultList.html

Get ALL runnerData from API for specific class and put into runnerDataArr array
Check runnerDataArr.length for number of runners received
Or better: Use JSON.stringify(data).length
*/

console.log("!!!! Loaded fetchRunnersData script !!!!");

function getJsonSize(data) {
  if (Array.isArray(data)) {
    // For arrays, return the number of elements
    return data.length;
  } else if (data !== null && typeof data === "object") {
    // For objects, return the number of top-level keys
    return Object.keys(data).length;
  }
  // For other types (string, number, etc.), return 0
  return 0;
}

async function fetchRunnersData(apiUrl) {
  // Using the AbortController with a timeout, you add an extra layer of fault handling
  // to ensure your application doesn’t wait indefinitely for a response.
  const controller = new AbortController();
  const timeout = 10000; // in milliseconds (10 seconds)
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // FIXME:
  apiUrl = "https://wmln67w3-5000.euw.devtunnels.ms/api/10/1/results";

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      // HTTP-level error (non 200-299 status)
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

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error(`Request timed out after ${timeout / 1000} seconds.`);
    } else if (error.message.includes("Failed to fetch")) {
      console.error(
        "Network error or CORS issue: Failed to fetch data. Please check your connection and API endpoint."
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }

    // Rethrow the error so that calling code can also handle it.
    throw error;
  }
}

// getFallbackData.js
async function getFallbackData(fallbackUrl) {
  // Set your fallback API URL. For example, you might have a separate endpoint just to fetch the top-10 runners,
  //const fallbackUrl = "http://85.24.189.92:5000/api/10/1/runners"; // adjust if you have a dedicated fallback URL
  try {
    const response = await fetch(fallbackUrl);
    if (!response.ok) {
      throw new Error(
        `HTTP error while fetching fallback data: ${response.status}`
      );
    }
    const data = await response.json();
    // Since your API returns an object with a "runners" property, extract that:
    let runners = data.runners || [];
    if (!Array.isArray(runners)) {
      throw new Error("Fallback data is not in array format!");
    }
    // Take only the top-10 runners:
    const topRunners = runners.slice(0, 10).map((runner, index) => {
      return {
        place: index + 1, // You can assign place values based on order (or if available in your data)
        bib: runner.bib,
        name: runner.name,
        runner_club: runner.runner_club,
        // FIXME: replace with final time when available!!!
        start_time: runner.start_time,
        after_leader: index === 0 ? "0" : "",
      };
    });
    return topRunners;
  } catch (error) {
    console.error("Error fetching fallback data:", error);
    // In case of failure, you can return an empty array or some hard-coded sample data.
    return [];
  }
}

async function fetchRunnersData_TEST(apiUrl) {
  console.log("apiUrl: ", apiUrl);
  try {
    // It is recommended to remove { mode: "no-cors" } if your endpoint supports CORS.
    // mode: "no-cors" returns an opaque response, which makes it hard to read the data.
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("======  DATA AFTER FETCH:", data);
    console.log("Size of DATA: ", JSON.stringify(data).length);

    return data;
  } catch (error) {
    console.error("Error fetching runners data:", error);
    // Optionally: fall back to sample data if you need something concrete while debugging:
    // return getSampleData();
    return null;
  }
}

// -----------------------------------------------------------------------------

// NOTE: JSON Specification Compliance: JSON mandates double quotes for key names.
/* FÖRSTA PROVSKOTTET 6/5:
const urlToAPI = "http://85.24.189.92:5000/api/10/1/runners";

console.warn("!!!! Starting fetch from API...");

fetch(urlToAPI) // { mode: "no-cors" })
  .then((response) => {
    // Response is opaque; you cannot read most of its content
    console.log(response);

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse JSON data
  })
  // Once fetched, the data remains in memory for the lifetime of the webpage
  .then((data) => {
    console.log("======  DATA AFTER FETCH (1):");
    console.log(data);
    console.log("Size of DATA: ", getJsonSize(data));
  })
  .catch((error) => {
    console.error("Error fetching JSON data:", error);
  });

fetch(urlToAPI)
  .then((response) => {
    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse JSON data
  })
  // Once fetched, the data remains in memory for the lifetime of the webpage
  .then((data) => {
    console.log("======  DATA AFTER FETCH (2):");
    console.log(data);
    console.log("Size of DATA: ", getJsonSize(data));

    //FIXME: Cache JSON data in localStorage ???
    jsonRunnerInfoDataGlob = data;

    // Skipping table headers in graphic overlay!
    if (document.getElementById("data-table")) {
      maxNumResultPages = Math.ceil(getJsonSize(data) / rowsPerResultPage); // 10 items per page

      // Initially load the first page, if there is a data table on the page
      //updateTable(getJsonSize(data));
      //console.log("updateTable() was CALLED!");
    }
  })
  .catch((error) => {
    console.error("Error fetching JSON data:", error);
  });
*/
// -------------------------------------------------------------------
