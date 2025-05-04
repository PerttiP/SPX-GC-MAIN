// This is a generic BASIC command handler
// between SPX and the template. See other
// SPX templates for more advanced functionality
// such as Update() etc..

console.warn("======== This version of this script is DEPRECATED!!! =========");

// GOAL:
/*

To generate several rundown files:
MedelFinal_D21_StartLista
MedelFinal_H21_StartLista
etc.

With DataField that has one dropdown:
field: "f_vald_runner",
        ftype: "dropdown",
        title: "Select Runner to Follow",
        value: "0",
        items: [ <Array> ]

And the <Array> should look like:
        items: [
              {
                text: "1 Anna Andersson",
                value: "1",
              },
              {
                text: "2",
                value: "Bridget Johnson",
              },
            ]

The values should be retrieved from
FOR MOCKTEST: from ASSETS\templates\oktyr\sm2025medeldist\startList_14items_5fields.json
We will not try to read/fetch files from any other location, like DATAROOT!!!

FOR REAL PRODUCTION: from API response of GET REQ 'get list of all runners for class = XX in competition = YY'
*/

//
// Helper functions
//-----------------------------------------------------------------

function isEmptyJson(data) {
  // Check for null or undefined
  if (data == null) {
    // == operator covers both null and undefined!
    return true;
  }

  // If it's an array, check its length
  if (Array.isArray(data)) {
    return data.length === 0;
  }

  // If it's an object (but not an array), check its keys
  if (typeof data === "object") {
    return Object.keys(data).length === 0;
  }

  // If it's a plain object (not array, not null)
  if (typeof data === "object" && data.constructor === Object) {
    return Object.keys(data).length === 0;
  }

  // For any other type (string, number, etc.), return false or adjust as needed
  return false;
}

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

let JSONDataFetchedFromFile = null;

//
// MOCKTEST: Get test data from json file
//

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
    console.log("Size of DATA: ", getJsonSize(data));
    console.log("======  DATA AFTER FETCH:");
    console.log(data);

    //FIXME: Cache JSON data in sessionStorage OR in localStorage OR in IndexedDB???
    jsonRunnerInfoDataGlob = data;
    JSONDataFetchedFromFile = data;

    //TODO: Override with hard coded test data here?

    // Now use the jsonRunnerInfoDataGlob for lower thirds with runner info by getRunnerData()
  })
  .catch((error) => {
    console.error("Error fetching JSON data:", error);
  });

console.log("FINISHED with fetching JSON data");
// SLUT VERSION SOM FUNKADE

//
// Construct items array for using it in dropdown
//

// Suppose your JSON data is already parsed and stored in the variable "data"
var testData = {
  item1: [
    { field: "f0", ftype: "number", title: "StartNumber", value: "444" },
    {
      field: "f1",
      ftype: "textfield",
      title: "Fullname",
      value: "Firstname Lastname",
    },
    { field: "f2", ftype: "textfield", title: "Club", value: "OK Tyr" },
    { field: "f4", ftype: "textfield", title: "Class", value: "D21" },
    { field: "f5", ftype: "textfield", title: "Starttime", value: "12:00" },
  ],
  item2: [
    { field: "f0", ftype: "number", title: "StartNumber", value: "445" },
    { field: "f1", ftype: "textfield", title: "Fullname", value: "Kalle Anka" },
    { field: "f2", ftype: "textfield", title: "Club", value: "OK Ankeborg" },
    { field: "f4", ftype: "textfield", title: "Class", value: "H21" },
    { field: "f5", ftype: "textfield", title: "Starttime", value: "12:15" },
  ],
};

// Initialize an array to hold each runner's string
var itemsArr = [];

//let data = JSONDataFetchedFromFile;

let data = testData;

// Loop through each item in the data object
for (var key in data) {
  if (data.hasOwnProperty(key)) {
    var runnerEntries = data[key];

    // Extract the start number and fullname by finding the corresponding entries.
    // (Alternatively, if the structure always has f0 first and f1 second, you could use those indexes.)
    var startField = runnerEntries.find(function (entry) {
      return entry.field === "f0" && entry.title === "StartNumber";
    });
    var nameField = runnerEntries.find(function (entry) {
      return entry.field === "f1" && entry.title === "Fullname";
    });
    if (startField && nameField) {
      var startVal = startField.value;
      var fullName = nameField.value;
      // Construct the object snippet with the "text" and "value" properties.
      // Make sure the value strings are wrapped in double quotes.
      var itemString =
        '{ text: "' +
        startVal +
        " - " +
        fullName +
        '", value: "' +
        startVal +
        '", }';
      itemsArr.push(itemString);
    }
  }
}

// Build the final string representation, ensuring no line breaks.
// The entire string is enclosed in single quotes.
var result = "'items: [" + itemsArr.join(",") + "]'";
console.log(result);

//
// SPX API REQ
//

/*
  https://spxgc.tawk.help/article/help-api
*/

// Define the values for your POST payload:
const projectName = "SPXAPITEST4"; // Avoid unusual characters!
const fileName = "myRundownFile44"; // Can both leave or include .json extension!
const content = {
  // content must be an object
  comment: "Playlist generated by OK Tyr via SPX API Endpoint",
  // Ensure you include a 'templates' array that is not empty.
  templates: [
    {
      // Path should start with /  !!!
      relpath: "/templates/myBaseTemplate.html", // Required for each template - This template MUST exist in ASSETS!
      DataFields: [
        // Populate with the required fields (must be non-empty)
        {
          field: "comment",
          ftype: "textfield",
          title: "Nickname of this item on the rundown",
          value: "[ NR NAMN KLUBB STARTTID ]",
        },
        {
          ftype: "instruction",
          value:
            "You can leave any field empty, except the start number (bib). This is a generic overlay with a Default theme.",
        },
        {
          field: "f_vald_runner",
          ftype: "dropdown",
          title: "Select Runner",
          value: "0 - Default Test Runner",
          items: [
            {
              text: "1 - Firstname Lastname",
              value: "1",
            },
            {
              text: "2 - Firstname Lastname",
              value: "2",
            },
            {
              text: "3 - Firstname Lastname",
              value: "3",
            },
          ],
        },
        {
          field: "f_vald_runner_2",
          ftype: "dropdown",
          title: "Select Runner",
          value: "0 - Default Test Runner",
          items: [
            { text: "444 - Firstname Lastname", value: "444" },
            { text: "445 - Kalle Anka", value: "445" },
          ],
        },
        {
          field: "f0",
          ftype: "textfield",
          title: "Bib Number of Runner to Follow",
          value: "999",
        },
        {
          field: "f1",
          ftype: "caption",
          title: "Fullname",
          value: "FirstName LastName",
        },
        // Additional DataFields if needed
        {
          field: "f99",
          ftype: "filelist",
          title: "Visual theme",
          assetfolder: "./css/themes/",
          extension: "css",
          value: "./css/themes/Default.css",
        },
      ],
      // Provide default values for other expected properties
      playserver: "OVERLAY",
      playchannel: "1",
      playlayer: "5",
      webplayout: "5",
      out: "manual",
      dataformat: "json",
      uicolor: "3",
      // These may be overridden later by the API if needed.
      description: "Default description for First Template",
    },
  ],
};

/*
// Stringified JSON
{
    "project": "myProjectName",
    "file": "newRundown.json",
    "content": {
        "comment": "Playlist generated by MyApp",
        "templates": [
            {
                "description": "First template",
                "playserver": "OVERLAY",
                "etc": "..."
            },
            {
                "description": "Second template",
                "playserver": "OVERLAY",
                "etc": "..."
            }
        ]
    }
}
*/

// Make the POST request to /rundown/json

const OLD_url = "http://192.168.50.62:5656/api/v1/rundown/json"; // For FireFox ONLY ???

const url = "http://192.168.50.158:5656/api/v1/rundown/json"; // For Chrome ONLY ???

// NOTE: If you’re running your client-side code on the same server as SPX‑GC,
// the relative URL /rundown/json should suffice.

// NOTE2: The relative path should be /api/v1/rundown/json!

fetch("/api/v1/rundown/json", {
  //fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // TODO: If your API key is passed in a header, include it here, e.g.:
    // 'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    project: projectName,
    file: fileName,
    content: content,
  }),
})
  .then((response) => {
    if (!response.ok) {
      // Handle non-200 HTTP responses
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Success:", data);
    // You can handle the returned info message here.
  })
  .catch((error) => {
    console.error("Error:", error);
    // You can display an error alert or a message in the UI.
  });
// end fetch
console.log("FINISHED with fetch of POST req to /rundown/json");

//
// TEST of string with quotation marks and apostrophes:
//

//Insert a backslash (\) before the double quote to tell JavaScript to treat it as a literal character rather than the end of the string.
// Men VS CODE omvandlar hela denna textsträng automagiskt till '       '!
let strTest0 =
  'Detta är en text so endast innhåller ett citationstecken här: " Och sedan inget mer förutom vanlig text.';

//If your string contains double quotes, you can wrap the string in single quotes to avoid escaping:
let strTest1 =
  'Detta är en text som jag vill ska innehålla citationstecken som ser ut "så här", sedan kan annan text komma';

function update(data) {
  // Push data to template fields
  const jsonData = JSON.parse(data);
  for (var field in jsonData) {
    if (document.getElementById(field)) {
      let value = jsonData[field];
      if (value == "null" || value == "undefined") value = "";
      document.getElementById(field).innerHTML = value;
    }
  }
}

function play() {
  // Execute animation in
  runAnimationIN();
}

function stop() {
  // Execute animation out
  runAnimationOUT();
}
