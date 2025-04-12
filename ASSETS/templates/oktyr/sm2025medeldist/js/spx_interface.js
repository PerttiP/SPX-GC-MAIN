// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

// Controller interface for softpix Template Pack 1.3.2 & for OK Tyr SM 2025.

// Receive item data from SPX Graphics Controller
// and store values in hidden DOM elements for
// use in the template.
/*
function update(data) {
  var templateData = JSON.parse(data);
  console.log('----- Update handler called with data:', templateData)
  for (var dataField in templateData) {
    var idField = document.getElementById(dataField);
    if (idField) {
      let fString = templateData[dataField];
      if ( fString != 'undefined' && fString != 'null' ) {
        idField.innerText = fString
      } else {
        idField.innerText = '';
      }
    } else {
      switch (dataField) {
        case 'comment':
        case 'epochID':
          // console.warn('FYI: Optional #' + dataField + ' missing from SPX template...');
          break;
        default:
          console.error('ERROR Placeholder #' + dataField + ' missing from SPX template.');
      }
    }
  }

  if (typeof runTemplateUpdate === "function") { 
    runTemplateUpdate() // Play will follow
  } else {
    console.error('runTemplateUpdate() function missing from SPX template.')
  }
}
*/

// ------------------------
//
// Modified update function
//
// ------------------------
/*
Key Adaptations:

1. Dynamic Row Handling:
    Automatically creates 10 empty rows on initial load.
    Only displays rows with actual data from JSON.
    Clears unused rows when data has fewer than 10 items.

2. JSON Mapping:

3. Automatic Refresh System:
    Safe interval checking with isUpdating flag.
    Error handling for failed fetches.
    Configurable update interval (currently 60 seconds).
*/
/*
Ensure your JSON endpoint matches the URL in the fetch() call.
Field mapping ignores "Location" (f3) and "Class" (f4) as requested.
Uses textContent instead of innerHTML for safer text rendering.
Handles null/undefined values by falling back to empty string.

*/
function update(data) {
  const jsonData = JSON.parse(data);
  const runnerData = jsonData.runners[0];
  const itemCount = Math.min(parseInt(runnerData.numberOfItems), 10);

  // Process each item
  for (let i = 1; i <= itemCount; i++) {
    const item = runnerData[`item${i}`];
    const rowIdx = i - 1;
    
    item.forEach(field => {
      const cellMap = {
        'f0': `number-${rowIdx}`,
        'f1': `name-${rowIdx}`,
        'f2': `club-${rowIdx}`,
        'f5': `start-${rowIdx}`
      };
      
      if (cellMap[field.field]) {
        const element = document.getElementById(cellMap[field.field]);
        if (element) element.textContent = field.value || '';
      }
    });
  }

  // Clear remaining rows
  for (let i = itemCount; i < 10; i++) {
    document.getElementById(`number-${i}`).textContent = '';
    document.getElementById(`name-${i}`).textContent = '';
    document.getElementById(`club-${i}`).textContent = '';
    document.getElementById(`start-${i}`).textContent = '';
  }
}

// Add periodic refresh
let isUpdating = false;
setInterval(async () => {
  if (!isUpdating) {
    isUpdating = true;
    try {
      const response = await fetch('runners_testdata.json'); //TODO: Set url to API?
      const data = await response.text();
      update(data);
    } catch (error) {
      console.error('Update failed:', error);
    }
    isUpdating = false;
  }
}, 60000); // Update every 60 seconds

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
    runAnimationOUT()
  } else {
    console.error('runAnimationOUT() function missing from SPX template.')
  }
}

// Continue handler
function next(data) {
  console.log('----- Next handler called.')
  if (typeof runAnimationNEXT === "function") { 
    runAnimationNEXT()
  } else {
    console.error('runAnimationNEXT() function missing from SPX template.')
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
    console.warn('Element ID is falsy, returning null.');
    return null;
  }
  if (!document.getElementById(elementID)) {
    console.warn('Element ' + elementID + ' not found, returning null.');
    return null;
  }
  return document.getElementById(elementID);
}

window.onerror = function (msg, url, row, col, error) {
  let err = {};
  err.file = url;
  err.message = msg;
  err.line = row;
  console.log('%c' + 'SPX Template Error Detected:', 'font-weight:bold; font-size: 1.2em; margin-top: 2em;');
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
      return false;  // not a valid string
      break;
  }
  return true; // is a valid string
}
