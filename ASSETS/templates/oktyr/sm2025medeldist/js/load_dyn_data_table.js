/*
    "Global" variables, outside of any functions or event handlers.
    These initialization variables are only executed once when the web page is loaded.
*/
let currentPage = 1; // Start at page 1
const maxPage = 3; // Total pages: 3 (30 items, 10 items per page)
const rowsPerPage = 10; // Number of rows per page

// Global Window variables
// ----------------------------------------------------
// Access these as TyrAppGlobals.startNumber in HTML/JS
// IT IS A FAST HACK (YES IT IS BAD I KNOW)

// If window.TyrAppGlobals does not exist (is undefined or null), 
// it assigns an empty object {} to it.
window.TyrAppGlobals = window.TyrAppGlobals || {};
if (window.TyrAppGlobals.jsonRunnerInfoData === undefined) {
  window.TyrAppGlobals.jsonRunnerInfoData = {}; // This will hold the fetched JSON data
}
// ----------------------------------------------------

// Fetch JSON data from the external file
//const path = require('path');
//import path from 'path';


// Get the root directory of the running Node.js application
// The value of require.main.filename always points to the entry file (e.g., server.js) that started the Node.js process
//const rootDir = path.dirname(require.main.filename);
/*
const spx = require('./spx_server_functions.js'); //FIXME: require is not defined
const rootDir = spx.getStartUpFolder(); //FIXME: spx is not defined
console.log('Root directory:', rootDir);

//jsonDataDir = path.join('rootDir', 'DATAROOT\SM2025\data\D21\startList_30items.json');

jsonDataDir = rootDir + 'DATAROOT\SM2025\data\D21\startList_30items.json'
console.log('JSON Data directory:', jsonDataDir);
*/

// FIXME2:
// fetch('http://yourwebsite.com/DATAROOT/Table_TestData/startList.json')

// IMPORTANT: the JSON file must be hosted on a server, for fetch to work!!!

// VERSION SOM FUNKAR:
//fetch(jsonDataDir) // retrieves all items from the JSON file in a single request
fetch('startList_30items.json')
    .then(response => {
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            //throw new Error(`HTTP error! status: ${response.status}`);
            // Attempt local file reading instead
            fs.readFile(jsonDataDir, 'utf-8')
                .then(data => {
                    return data.json();
                })
                .catch(error => console.error('Error loading JSON data also with fs.readFile:', error));
        }
        return response.json(); // Parse JSON data
    })
    // Once fetched, the data remains in memory for the lifetime of the webpage
    .then(data => {
        window.TyrAppGlobals.jsonRunnerInfoData = data; // Store JSON data globally!

        // Populate the table
        const table = document.getElementById('data-table');

        //const headers = ["Number", "Fullname", "Club", "Starttime"]; // Hardcoded column headers, max 4 !!
        // Skipping table headers!   

        
        if (document.getElementById('data-table')) {
            // Initially load the first page, if there is a data table on the page
            updateTable();
        }
        else {
            // Or else, just use the jsonRunnerInfoData for lower thirds with runner info by getRunnerData()
            // TODO: nothing
        }
        

        // Populate only ONE page:
        /*
        const tbody = document.createElement('tbody');
        Object.values(data).forEach(itemGroup => {
            const row = document.createElement('tr');
            itemGroup.slice(0, headers.length).forEach(item => {
                const td = document.createElement('td');
                td.textContent = item.value || ""; // Use empty string if value is null
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        */
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });
// SLUT VERSION SOM FUNKAR


// Global function to update table rows dynamically based on the current page
function updateTable() {
    const table = document.getElementById('data-table');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ""; // Clear previous rows

    const startIndex = (currentPage - 1) * rowsPerPage; // Determine start index for current page
    const endIndex = startIndex + rowsPerPage; // Determine end index for current page
    const pageDataKeys = Object.keys(window.TyrAppGlobals.jsonRunnerInfoData).slice(startIndex, endIndex); // Get relevant keys for the page

    pageDataKeys.forEach(key => {
        const itemGroup = window.TyrAppGlobals.jsonRunnerInfoData[key]; // Fetch data for each item
        const row = document.createElement('tr');
        if (itemGroup) {
            itemGroup.slice(0, 4).forEach(item => { // Only use first 4 fields
                const td = document.createElement('td');
                td.textContent = item.value || ""; // Use empty string if value is null
                row.appendChild(td);
            });
            tbody.appendChild(row);
        }
    });
}