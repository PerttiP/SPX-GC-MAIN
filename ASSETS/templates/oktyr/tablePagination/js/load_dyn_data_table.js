/*
const jsonData = {
    "item1": [
        { "field": "f0", "ftype": "textfield", "title": "Number", "value": "444" },
        { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Namn Namnsson" },
        { "field": "f2", "ftype": "textfield", "title": "Club", "value": "OK Tyr" },
        { "field": "f3", "ftype": "textfield", "title": "Location", "value": "" },
        { "field": "f4", "ftype": "textfield", "title": "Class", "value": "D21" },
        { "field": "f5", "ftype": "textfield", "title": "Starttime", "value": "12:00" }
    ],
    "item2": [
        { "field": "f0", "ftype": "textfield", "title": "Number", "value": "445" },
        { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Kalle Anka" },
        { "field": "f2", "ftype": "textfield", "title": "Club", "value": "OK Ankeborg" },
        { "field": "f3", "ftype": "textfield", "title": "Location", "value": "" },
        { "field": "f4", "ftype": "textfield", "title": "Class", "value": "H21" },
        { "field": "f5", "ftype": "textfield", "title": "Starttime", "value": "12:15" }
    ]
};
*/

// Fetch JSON data from the external file

// FIXME: 
// fetch('./DATAROOT/Table_TestData/startList.json')

// FIXME2:
// fetch('http://yourwebsite.com/DATAROOT/Table_TestData/startList.json')


// VERSION SOM INTE FUNKAR:
/*
fetch('./DATAROOT/Table_TestData/startList.json')
    .then(response => { return response.json(); })
    .then(data => {

        // Create table column headers dynamically
        const table = document.getElementById('data-table');
        //const headers = ["Number", "Name", "Club", "Start"]; // Hardcoded column headers

        // Create table headers from JSON
        const headers = jsonData.item1.map(item => item.title); // ["Number", "Fullname", "Club", "Location", "Class", "Starttime"]

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Populate table rows from JSON data
        const tableBody = document.querySelector('tbody');
        const maxRows = 10;

        Object.values(data).forEach((itemGroup, index) => {
            if (index >= maxRows) return; // Ensure max 10 rows

            const row = document.createElement('tr');
            itemGroup.slice(0, headers.length).forEach(item => {
                const cell = document.createElement('td');
                cell.textContent = item.value || ""; // Use empty string if value is missing
                row.appendChild(cell);
            });

            // If row data is empty, add "hidden" class
            const isEmpty = itemGroup.every(item => !item.value);
            if (isEmpty) {
                row.classList.add('hidden'); // Make rows with no data invisible
            }

            tableBody.appendChild(row);
        });

        // Fill remaining rows with hidden placeholders to maintain table layout
        const currentRowCount = tableBody.querySelectorAll('tr').length;
        for (let i = currentRowCount; i < maxRows; i++) {
            const placeholderRow = document.createElement('tr');
            placeholderRow.classList.add('hidden'); // Invisible row
            for (let j = 0; j < headers.length; j++) { 
                const placeholderCell = document.createElement('td');
                placeholderRow.appendChild(placeholderCell);
            }
            tableBody.appendChild(placeholderRow);
        }
    })
    .catch(error => console.error('Error loading JSON data:', error));
*/

// VERSION SOM FUNKAR:
fetch('startList.json')
    .then(response => {
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            //throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON data
    })
    .then(data => {
        // Populate the table
        const table = document.getElementById('data-table');
        const headers = ["Number", "Fullname", "Club", "Starttime"]; // Hardcoded column headers, max 4 !!!

        // Create table headers from JSON (NOT WORKING: Cannot have all, only 4 columns)
    //    const headers = jsonData.item1.map(item => item.title); // ["Number", "Fullname", "Club", "Location", "Class", "Starttime"]

        // Create table headers dynamically
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Populate table rows from JSON data
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
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });
// SLUT VERSION SOM FUNKAR


// VERSION SOM FUNKAR:
/*
fetch('startList.json')
    .then(response => {
        if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            //throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON data
    })
    .then(data => {
        // Populate the table
        const table = document.getElementById('data-table');
        const headers = ["Number", "Name", "Club", "Start"]; // Hardcoded column headers

        // Create table headers dynamically
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Populate table rows from JSON data
        const tbody = document.createElement('tbody');
        Object.values(data).forEach(itemGroup => {
            const row = document.createElement('tr');
            itemGroup.slice(0, 4).forEach(item => { // Only use first 4 fields
                const td = document.createElement('td');
                td.textContent = item.value || ""; // Use empty string if value is null
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });
*/
// SLUT VERSION SOM FUNKAR