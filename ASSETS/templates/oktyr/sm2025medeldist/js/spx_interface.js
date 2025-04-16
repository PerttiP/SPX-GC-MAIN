// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

//
//  Ensure spx_interface.js is responsible for all DOM updates and interactions with window.SPXGCTemplateDefinition.
//


// TEST: Global Window variables
// -----------------------------

//window.TyrApp = {startNumber: 0}; // Access this as TyrApp.startNumber in HTML/JS

// FAST HACK (YES IT IS BAD I KNOW)
// If window.AppGlobals does not exist (is undefined or null), it assigns an empty object {} to it.
window.TyrAppGlobals = window.TyrAppGlobals || {};
if (window.TyrAppGlobals.startNumber === undefined) {
  window.TyrAppGlobals.startNumber = 0;
}
if (window.TyrAppGlobals.jsonRunnerInfoData === undefined) {
  window.TyrAppGlobals.jsonRunnerInfoData = {}; // This will hold the fetched JSON data
}


// Update the DOM and SPXGCTemplateDefinition here!
// Receive item data from SPX Graphics Controller (field editor)
// and store values in hidden DOM elements for use in the template.

function update(data) {
  var templateData = JSON.parse(data);
  console.log('----- Update handler called with data:', templateData)

  // Iterate over all enumerable properties
  for (var dataField in templateData) {
    // Retrieve the element whose id matches the current key
    var idField = document.getElementById(dataField);
    if (idField) {
      // Retrieve the field text value
      let fString = templateData[dataField];
      if ( fString != 'undefined' && fString != 'null' ) {
        // Update the visible content of the element
        idField.innerText = fString
      } else {
        idField.innerText = '';
      }
    } else {
      //alert('update(data) - IN ELSE BRANCH!');
      // Pertti: Enter else branch here if NOT found the field in DOM...
      // We do enter this else branch when PLAY clicked (and fields changed?)
      switch (dataField) {
        case 'comment':
        case 'epochID':
          console.warn('FYI: Optional #' + dataField + ' missing from SPX template...');
          break;
          //FIXME: What can these be used for?
          case 'f_list_titel':
            //alert('Update handler with f_list_titel');
            break;
          case 'f_vald_klass':
            //alert('Update handler with f_vald klass');
            break;
          case 'f0':
            alert('Update handler with missing f0');
            break;
          case 'f1':
            alert('Update handler with missing f1');
            break;
          case 'f2':
            alert('Update handler with missing f2');
            break;
          case 'f3':
            alert('Update handler with missing f3');
            break;
          
        default:
          console.error('ERROR Placeholder #' + dataField + ' missing from SPX template.');
      }
    }
  }

  console.log('NOW CALLING runTemplateUpdate() - Play will follow?');

  // Once DOM updated we can initPageData and run animations...
  if (typeof runTemplateUpdate === "function") { 
    runTemplateUpdate() // Play will follow
  } else {
    console.error('runTemplateUpdate() function missing from SPX template.')
  }
}

// Borrowed from views\view-renderer.handlebars:
function formatJSONAndSetDomFields(fieldData) {
  console.log('formatJSONAndSetDomFields:', fieldData);
  let formattedJsonOut = {};
  if (fieldData) {
      var keys = [];
      for (var k in fieldData) keys.push(k);
      fieldData.forEach((item,index) => {
          let KEY = Object.keys(item)[0];
          let VAL = fieldData[index][Object.keys(item)[0]]
          formattedJsonOut[KEY]=VAL;
      });
      return JSON.stringify(formattedJsonOut)
  }
}

function checkWindowTyrAppGlobals() {
  // Check if window.TyrAppGlobals.jsonRunnerInfoData is defined and is an object
  if (!window.TyrAppGlobals || !window.TyrAppGlobals.jsonRunnerInfoData || typeof window.TyrAppGlobals.jsonRunnerInfoData !== 'object') {
    console.error('window.TyrAppGlobals.jsonRunnerInfoData is not defined or not an object');
    return false;
  }
  return true;
}

function findMatchingRunner(startNumberStr) {
  if (!checkWindowTyrAppGlobals) { return null; }

  // Get the list of entries from jsonRunnerInfoData
  const runnerInfoEntries = Object.entries(window.TyrAppGlobals.jsonRunnerInfoData);

  console.log(typeof startNumberStr);  

  // Iterate through each entry
  for (const [key, fields] of runnerInfoEntries) {

    console.log(typeof fields);

      // Search for a field where title is "Number" and value matches startNumberStr
      const matchingField = fields.find(field => {
          console.log(typeof field.value);
          return field.title === "Number" && field.value === startNumberStr;
      });

      // If a matching field is found, return the key and fields
      if (matchingField) {
          return { key, fields };
      }
  }

  // If no matching runner is found, return null
  return null;
}

// This getRunnerData function is triggered by extra button 'Get Runners'!
function getRunnerData(startNumber) {
  const item = findMatchingRunner(startNumber.toString());
  if (item) {
      console.log(item);
      //FIXME:
      //ALT 1: Is it now we can call update() function above???
      update(item.JSON);

      //ALT2: Or do we need to do sth more???
  }
  else {
    alert('Numret kunde inte hittas.');
  }
}

// Custom Controls Button event handler
function getRunner() {
  //alert('getRunner() CALLED!'); //OK ALSO FROM /templates/oktyr/.../js/spx_interface.js folder!

  // Note: The prompt() function only works in client browsers, not in Node.js server-side!
  let input = prompt("Ange nummerlapps-nummer (1-999):", "0");
  if (input !== null) {
      let number;        
      try {
          number = parseInt(input); // Convert to integer
      }
      catch {
          console.error("Invalid number entered. Failed to parse as Int");
      }       
      
      if (!isNaN(number)) {
          // Use the integer value as needed
          console.log("The number entered is:", number); // OK SO FAR!
          window.TyrAppGlobals.startNumber = number;

          // TODO:
          // Can we initiate the fetching of runner data from here?
          getRunnerData(number);
          //window.TyrAppGlobals.getRunnerData(number);

      } else {
          console.log("Invalid number entered. Please add another number (1-999)");
          alert('Numret var felaktigt. Försök med annat nummer (1-999)');          
          // We keep the previous start number?
      }
  }
}

// Play handler
function play() {
  // console.log('----- Play handler called.')
  if (typeof runAnimationIN === "function") { 
    runAnimationIN()
  } else {
    console.error('runAnimationIN() function missing from SPX template.')
  }
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
  console.log('----- SPX Next handler called.')
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
  console.log('%c' + 'SPX Template Error Detected:', 
    'font-weight:bold; font-size: 1.2em; margin-top: 2em;');
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
      return false  // not a valid string
      break;
  }
  return true; // is a valid string
}
