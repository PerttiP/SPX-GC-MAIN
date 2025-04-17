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
  if (data.startsWith("<templateData>")) {
    //let parser = new DOMParser();
    //SEE 'BUMPER' demo in Template_Pack_1.3.2 for parsing example
    console.log('----- Update handler where data starts with <templateData>');
  }

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
          case 'f1':            
          case 'f2':            
          case 'f3':
            console.error('Required Placeholder #' + dataField + ' missing from SPX template.');
            break;          
        default:
          console.error('Placeholder #' + dataField + ' missing from SPX template.');
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

// Example JSON structure
const jsonDataForTest = {
  "item1": [
      { "field": "f0", "ftype": "number", "title": "Number", "value": "444" },
      { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Namn Namnsson" }
  ],
  "item2": [
      { "field": "f0", "ftype": "number", "title": "Number", "value": "445" },
      { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Kalle Anka" }
  ]
};

function findMatchingRunner(startNumber) {
  // Convert startNumber to a string for comparison
  const targetValue = startNumber.toString();

  let jsonData = jsonDataForTest;

  // Iterate over the items in the JSON structure
  for (const itemKey in jsonData) {
      console.info(itemKey);

      if (jsonData.hasOwnProperty(itemKey)) {
          const itemArray = jsonData[itemKey];
          
          // Search through the array of objects for matching criteria
          for (const obj of itemArray) {
              if (
                  obj.ftype === "number" && 
                  obj.title === "Number" && 
                  obj.value === targetValue
              ) {
                  return { itemKey, obj }; // Return the matching item and its parent key
              }
          }
      }
  }

  // Return null if no match is found
  return null;
}

// This getRunnerData function is triggered by extra button 'Get Runners'!
function getRunnerData(startNumber) {
  if (typeof startNumber !== 'number') {   
      console.error("Invalid number");
      return;
  }

  const item = findMatchingRunner(startNumber.toString());
  console.log( item );

  if (item !== null) {
    console.log( item.itemKey );
    if (item.obj !== null) {
      console.log(item.obj);
      //FIXME:
      //ALT 1: Is it now we can call update() function above???
      //update(item.obj.JSON);
  //    update(item.obj);

      //ALT2: Or do we need to do sth more???

      //FIXME:
      // I now want to update the textfields in editor with values from item.obj

      const field_f0 = document.getElementById('f0');
      field_f0.innerText = " 000 ";

      const field_f1 = document.getElementById('f1');
      field_f1.innerText = " Nu vill jag skriva över ett nytt namn här ";

    }

      
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
    let input_number = NaN;        
    try {
        input_number = parseInt(input); // Convert to integer
    }
    catch {
        console.error("Invalid number entered. Failed to parse as Int");
    }       
    
    if (!isNaN(input_number)) {
        // Use the integer value as needed
        console.log("The number entered is:", input_number); // OK SO FAR!
        window.TyrAppGlobals.startNumber = input_number;

        // TODO:
        // Can we initiate the fetching of runner data from here?
        getRunnerData(input_number);
        //window.TyrAppGlobals.getRunnerData(input_number);

    } else {
        console.log("Invalid number entered. Please try another number (1-999)");
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
