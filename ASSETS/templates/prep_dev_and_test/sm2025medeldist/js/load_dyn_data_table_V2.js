/*
    "Global" variables, outside of any functions or event handlers.
    These initialization variables are only executed once when the web page is loaded.
*/
let currentPage = 1; // Start at page 1
let maxNumPages = 1;
const rowsPerPage = 10; // Number of rows per page

jsonRunnerInfoDataGlob = {};

// Global Window variables
// ----------------------------------------------------------
// 2025-04-18 18:00: MOVED ALL GLOBALS to init_global_data.js
//                   which is LOADED ON TOP in HTML head !!!
// ----------------------------------------------------------

/*
The values should be retrieved from
FOR MOCKTEST: from ASSETS\templates\oktyr\sm2025medeldist\startList_14items.json
We will not try to read/fetch files from any other location, like DATAROOT!!!

FOR REAL PRODUCTION: from API response of GET REQ 'get list of all runners for class = XX in competition = YY'
*/

/*
PATH TO PROJECT PROFILE:
'DATAROOT\SM2025\data\SPX_API_TEST\profile.json'

PATH TO RUNDOWN FILES:
'DATAROOT\SM2025\data\SPX_API_TEST\data\<RUNDOWN_FILE>.json
*/

console.log(
  "!!!! NOTE: This load_dyn_data_table.js script MUST EXECUTE SECOND AFTER THE init_global_data.js script !!!!"
);

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

// -----------------------------------------------------------------------------

// IMPORTANT: the JSON file must be hosted on a server, for fetch to work!!! ???
// Retrieve all items from the JSON file in a single request.

// NOTE: JSON Specification Compliance: JSON mandates double quotes for key names.
fetch("startList_14items.json") // NOTE: This has title 'StartNumber and field 'f3' has been removed!
  //fetch("startList_12items.json") // NOTE: This has 'number' as ftype for f0!
  //fetch('startList_30items.json')  // NOTE: This has 'textfield' for f0 !!!

  .then((response) => {
    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse JSON data
  })
  // Once fetched, the data remains in memory for the lifetime of the webpage
  .then((data) => {
    console.log("======  DATA AFTER FETCH:");
    console.log(data);
    console.log("Size of DATA: ", getJsonSize(data));

    //FIXME: Cache JSON data in localStorage ???
    jsonRunnerInfoDataGlob = data;

    // Skipping table headers in graphic overlay!
    if (document.getElementById("data-table")) {
      maxNumPages = Math.ceil(getJsonSize(data) / rowsPerPage); // 10 items per page

      // Initially load the first page, if there is a data table on the page
      updateTable(getJsonSize(data));
      console.log("updateTable() was CALLED!");
    } else {
      // Or else, use the jsonRunnerInfoDataGlob for lower thirds with runner info by getRunnerData()

      console.log(
        "Size of jsonRunnerInfoDataGlob: ",
        getJsonSize(jsonRunnerInfoDataGlob)
      ); //30

      // TODO:
      // OR MAYBE now call a function in spx_interface.js that will init a "global" var for the data ???
      //    initJSONRunnerData(data);

      // OR MAYBE set a "global" variable in the spx_interface.js ???

      // OR Cache JSON data in sessionStorage or IndexedDB???
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

function updateTable(numTotalItems, numPages) {
  const table = document.getElementById("data-table");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = ""; // Rensar tidigare rader

  const startIndex = (currentPage - 1) * rowsPerPage; // Startindex för den aktuella sidan
  const endIndex = startIndex + rowsPerPage; // Slutindex för den aktuella sidan
  console.log("startIndex:", startIndex);
  console.log("endIndex:", endIndex);

  if (numTotalItems % rowsPerPage !== 0) {
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
  if (numRowsAdded < rowsPerPage) {
    const missingRows = rowsPerPage - numRowsAdded;
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

/*
function updateTable(numTotalItems, numPages) {
  const table = document.getElementById("data-table");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = ""; // Clear previous rows

  const startIndex = (currentPage - 1) * rowsPerPage; // Determine start index for current page
  const endIndex = startIndex + rowsPerPage; // Determine end index for current page
  console.log("startIndex:", startIndex);
  console.log("endIndex:", endIndex);

  if (numTotalItems % rowsPerPage != 0) {
    console.warn("We must take care of items less than 10 for the last page!");
  }

  // Get relevant keys for the page
  console.log("Value of data:", jsonRunnerInfoDataGlob);

  const pageDataKeys = Object.keys(jsonRunnerInfoDataGlob).slice(
    startIndex,
    endIndex
  );

  pageDataKeys.forEach((key) => {
    const itemGroup = jsonRunnerInfoDataGlob[key]; // Fetch data for each item
    const row = document.createElement("tr");
    if (itemGroup) {
      itemGroup.slice(0, 4).forEach((item) => {
        // Only use first 4 fields
        const td = document.createElement("td");
        td.textContent = item.value || ""; // Use empty string if value is null
        row.appendChild(td);
      });
      tbody.appendChild(row);
    }
  });
}
*/
// -------------------------------------------------------------------

console.log("!!!! Now load_dyn_data_table.js script has FINISHED !!!!");
