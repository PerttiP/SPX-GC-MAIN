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
    
fetch('startList.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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


/*
const table = document.getElementById('data-table');

// Create table headers
const headers = jsonData.item1.map(item => item.title); // ["Number", "Fullname", "Club", "Location", "Class"]
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
});
thead.appendChild(headerRow);
table.appendChild(thead);

// Populate table rows
const tbody = document.createElement('tbody');
Object.values(jsonData).forEach(itemGroup => {
    const row = document.createElement('tr');
    itemGroup.slice(0, 5).forEach(item => { // Only take the first 5 fields
        const td = document.createElement('td');
        td.textContent = item.value || ""; // Use empty string if value is null
        row.appendChild(td);
    });
    tbody.appendChild(row);
});
table.appendChild(tbody);
*/