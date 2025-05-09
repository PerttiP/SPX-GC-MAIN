/*
    "Global" variables, outside of any functions or event handlers.
    These initialization variables are only executed once when the web page is loaded.
*/
let currentResultPage = 1; // Start at page 1
let maxNumResultPages = 1;
const rowsPerResultPage = 10; // Number of rows per page

jsonRunnerInfoDataGlob = {};

// Global Window variables
// ----------------------------------------------------------
// 2025-04-18 18:00: MOVED ALL GLOBALS to init_global_data.js
//                   which is LOADED ON TOP in HTML head !!!
// ----------------------------------------------------------

/*
FOR REAL PRODUCTION: 
Get values from API response of GET REQ 'get list of all runners for class = XX in competition = YY'

TODO:

Get ALL runnerData results from API for specific class and put into runnerDataArr array
runnerDataArr.length
*/

console.log("!!!! Started load_runners_into_data_table script !!!!");

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

// 1. A helper function to fetch runner data from the API endpoint.
async function fetchRunnerData(apiUrl) {
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
    console.error("Error fetching runner data:", error);
    // Optionally: fall back to sample data if you need something concrete while debugging:
    // return getSampleData();
    return null;
  }
}

// -----------------------------------------------------------------------------

// IMPORTANT: the JSON file must be hosted on a server, for fetch to work!!! ???
// Retrieve all items from the JSON file in a single request.

// NOTE: JSON Specification Compliance: JSON mandates double quotes for key names.

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

// Global function to update table rows dynamically based on the current page
/**
A table like this must exist in HTML:
<table id="data-table">
  <!-- No table header -->
  <tbody>
    <!-- Rows will be populated dynamically via JavaScript -->
  </tbody>
</table>
*/

/* OLD VERSION: replaced with renderTable in HTML body section */
/*
function updateTable(numTotalItems, numPages) {
  const table = document.getElementById("data-table");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = ""; // Rensar tidigare rader

  const startIndex = (currentResultPage - 1) * rowsPerResultPage; // Startindex för den aktuella sidan
  const endIndex = startIndex + rowsPerResultPage; // Slutindex för den aktuella sidan
  console.log("startIndex:", startIndex);
  console.log("endIndex:", endIndex);

  if (numTotalItems % rowsPerResultPage !== 0) {
    console.warn(
      "Vi måste hantera fallet med färre än 10 poster på den sista sidan!"
    );
  }

  // Hämta de relevanta nycklarna för den aktuella sidan
  console.log("Värde av data:", jsonRunnerInfoDataGlob);
  const pageDataKeys = Object.keys(jsonRunnerInfoDataGlob).slice(
    startIndex,
    endIndex
  );

  // Skapa rader med data
  pageDataKeys.forEach((key) => {
    const itemGroup = jsonRunnerInfoDataGlob[key]; // Hämtar data för varje item
    const row = document.createElement("tr");
    if (itemGroup) {
      // Vi använder endast de första 4 fälten
      itemGroup.slice(0, 4).forEach((item) => {
        const td = document.createElement("td");
        td.textContent = item.value || ""; // Skriv ut värdet eller en tom sträng om det saknas
        row.appendChild(td);
      });
      tbody.appendChild(row);
    }
  });

  // Om antalet rader på sidan är färre än rowsPerPage, lägg till extra tomma rader
  const numRowsAdded = pageDataKeys.length;
  if (numRowsAdded < rowsPerResultPage) {
    const missingRows = rowsPerResultPage - numRowsAdded;
    for (let i = 0; i < missingRows; i++) {
      const emptyRow = document.createElement("tr");
      // Lägg till 4 tomma celler per rad
      for (let j = 0; j < 4; j++) {
        const td = document.createElement("td");
        // Använd &nbsp; om du vill att cellen inte ska kollapsa helt
        td.innerHTML = "&nbsp;";
        emptyRow.appendChild(td);
      }
      tbody.appendChild(emptyRow);
    }
  }
}
*/
// -------------------------------------------------------------------

console.log("!!!! Now load_runners_into_data_table script has FINISHED !!!!");
