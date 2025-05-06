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
DEPRECATED VERSION - Do NOT use for real env!
*/

console.log(
  "!!!! DEPRECATED !!!! Started load_results_into_data_table script !!!!"
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

const urlToAPI = "http://85.24.189.92:5000/api/10/1/runners";
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
    console.log("======  DATA AFTER FETCH:");
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

/* OLD VERSION: replaced with renderTabke in HTML body section */
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

console.log("!!!! Now load_results_into_data_table script has FINISHED !!!!");
