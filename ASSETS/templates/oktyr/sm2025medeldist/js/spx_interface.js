// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

/*
  "Global" variables, outside of any functions or event handlers.
  These initialization variables are only executed once when the web page is loaded.
*/

selectedStartNumberGlob = 0;
// TODO:
// IDEA: Maybe I should have a global to store the newData I want to force push to editor + overlay?

runnerDataToUpdateGlob = {};

// and by a flag 'forceNewDataUpdate' in update() use that data instead of the data sent from the SPX Layers?
// OR EVEN BETTER?: Reuse the 'selectedStartNumberGlob' like this:
//    selectedStartNumberGlob = 0   ->  Use field values from EDITOR! (default)
//    selectedStartNumberGlob > 0   ->  Use data from search in JSON data by startNumber selected by user!
forceNewDataUpdateGlob = false;

// 2025-04-18 18:00: MOVED 'window' object GLOBALS (window.TyrAppGlobals) to init_global_data.js and LOADED ON TOP in HTML head !!!

/*
IMPORTANT:
  Scope of window Object: 
  Ensure that this code runs in a context where window is available, such as in browsers. 
  It won't work in environments like Node.js that do not provide a global window object.

  Ensure spx_interface.js is responsible for all DOM updates and interactions with window.SPXGCTemplateDefinition.
*/

//-----------------------------------------------------------------

function isEmptyJson(data) {
  // Check for null or undefined
  if (data == null) { // == operator covers both null and undefined!
    return true;
  }
  
  // If it's an array, check its length
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  
  // If it's an object (but not an array), check its keys
  if (typeof data === 'object') {
    return Object.keys(data).length === 0;
  }

  // If it's a plain object (not array, not null)
  /*
  if (typeof data === 'object' && data.constructor === Object) {
    return Object.keys(data).length === 0;
  }
  */
  
  // For any other type (string, number, etc.), return false or adjust as needed
  return false;
}

function getJsonSize(data) {
  if (Array.isArray(data)) {
    // For arrays, return the number of elements
    return data.length;
  } else if (data !== null && typeof data === 'object') {
    // For objects, return the number of top-level keys
    return Object.keys(data).length;
  }
  // For other types (string, number, etc.), return 0
  return 0;
}


// PERTTI TODO FUNCTION OR PUT IN OTHER TEST FUNCTION?
/*
function updateGlobalTemplateDef() {
  // Update the global template definition if needed:
  window.SPXGCTemplateDefinition.DataFields = window.SPXGCTemplateDefinition.DataFields.map(field => {
    if (["f0", "f1", "f2", "f3"].includes(field.field)) {
      // Update based on the field id
      return {
        ...field,
        value: newValues[field.field]
      };
    }
    return field;
  });
}
*/

// PERTTI TEST 2025-04-18 (em):
function updateGlobalTemplateValues(fieldUpdates) {
  // Check that the global variable exists
  if (
    window.SPXGCTemplateDefinition &&
    Array.isArray(window.SPXGCTemplateDefinition.DataFields)
  ) {
    window.SPXGCTemplateDefinition.DataFields.forEach(function(fieldObj) {
      // Only update if the object has a "field" property that matches one in our updates
      if (fieldObj.field && fieldUpdates.hasOwnProperty(fieldObj.field)) {
        fieldObj.value = fieldUpdates[fieldObj.field];
      }
    });
  } else {
    console.error("SPXGCTemplateDefinition or its DataFields array does not exist");
  }
  console.log('EXITED updateGlobalTemplateValues');
}

/**
 * Dynamically extracts the field identifiers (f0, f1, etc.) and their corresponding value properties.
 * @param {*} jsonData 
 * @returns 
 */
function extractFieldValues(jsonData) {
  if (!jsonData || !Array.isArray(jsonData)) {
      console.error("Invalid or missing JSON data.");
      return null;
  }

  const valuesToUpdate = {};

  jsonData.forEach(item => {
      if (item.field && item.value !== undefined) {
          valuesToUpdate[item.field] = item.value; // Map field to its value
      }
  });

  return valuesToUpdate;
}


// For example, update f0 and f1 accordingly:
//updateTemplateValues({
//  f0: "444",            // Update for Startnumber
//  f1: "Nicke Nyfiken"   // Update for Fullname
//});


// Optionally if you wish to update f2 and f3 too, include them in the object:
// updateTemplateValues({
//   f0: "444",
//   f1: "Nicke Nyfiken",
//   f2: "Some Club",    // if needed
//   f3: "Some Location" // if needed
// });


// PERTTI TEST FUNCTION 2025-04-18 (fm):

function forceEditorFieldsUpdate(newData) {
  console.log(typeof newData); 
  if (typeof newData !== 'object') {
    console.error("forceEditorFieldsUpdate: newData must be an object!");
    // TODO?: If it's a string, attempt to parse it as JSON?
    return;
  }

  console.log('forceEditorFieldsUpdate: newData:'); 
  console.log(newData);

  // FIXME?:
  // Push data to template fields (borrowed from Two-Tones template pack)
  // If an object is passed, use it directly
  const jsonData = newData;

  for (var field in jsonData) {
    if (document.getElementById(field)) {
      console.log('field: ' + field);
      let value = jsonData[field]
      console.log('value: ' + value);
      if ( value == "null" || value == "undefined" ) value = "";

      // Update content with HTML markup
    //  document.getElementById(field).innerHTML = value;

      // 2025-04-18 (em)
      // FIXME: Or use innerText ???
      // Update content as plain, visible text only
      document.getElementById(field).innerText = value;
      // e('f0').innerText
    }
  }

  // OR something like this?:
  /*
    const elF0 = document.getElementById("f0");
    const elF1 = document.getElementById("f1");
    const elF2 = document.getElementById("f2");
    const elF3 = document.getElementById("f3");
    if (elF0) { // If the element is found
      elF0.value = runnerDataToUpdate.f0;
    }
    if (elF1) { 
      elF1.value = runnerDataToUpdate.f1;
    }
    if (elF2) { 
      elF2.value = runnerDataToUpdate.f2;
    }
    if (elF3) { 
      elF3.value = runnerDataToUpdate.f3;
    }
    */

    // Update hidden data elements
    // If the hidden fields holding the values have IDs "f0", "f1", "f2", and "f3", this snippet will update those.
    /*
    Object.keys(runnerDataToUpdate).forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.textContent = runnerDataToUpdate[fieldId];
      }
    });
  */
}

// END PERTTI TEST FUNCTION
// ------------------------

// function update()
// IS CALLED by playLayer when pressing PLAY button!
// IS CALLED by updateLayer via SPX CMD 'updateTemplate'.
// Update the DOM and SPXGCTemplateDefinition here!
// Receive item data from SPX Graphics Controller (field editor)
// and store values in hidden DOM elements for use in the template.

function update(data) {
  //alert('update(data) ENTERED!');
  /*
  if (data.startsWith("<templateData>")) {
    //let parser = new DOMParser();
    //SEE 'BUMPER' demo in Template_Pack_1.3.2 for parsing example
    console.log('----- Update handler where data starts with <templateData>');
  }
  */  

  let templateData;  

  // Decide if:
  // UPDATE CODE FLOW: replacing with new data found from JSON data search by startNumber.
  // Or:
  // ORIGINAL CODE FLOW: use original data from editor fields 

  if (checkWindowTyrAppGlobals() && forceNewDataUpdateGlob) {
    if (!isEmptyJson(window.TyrAppGlobals.jsonRunnerForcedPushData)) {
      console.log('----- Using jsonRunnerForcedPushData!');
      templateData = window.TyrAppGlobals.jsonRunnerForcedPushData;
    }
    else {
      console.error('jsonRunnerForcedPushData from Globals (upd) WAS EMPTY!');
      console.log('getJsonSize(jsonRunnerForcedPushData from Globals (upd)): ', getJsonSize(window.TyrAppGlobals.jsonRunnerForcedPushData));
      //TODO: Fallback? - How?
      //templateData = JSON.parse(data);
    }
  }
  else {
    console.log('Original code flow for update');
    templateData = JSON.parse(data);
  }

  console.log('----- Update handler called, using data:', templateData);
  console.log('getJsonSize(templateData): ', getJsonSize(templateData));  

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
/*
  if (typeof runTemplateUpdate === "function") { 
    runTemplateUpdate() // Play will follow
  } else {
    console.error('runTemplateUpdate() function missing from SPX template.')
  }
*/

  // PERTTI TEST 2025-04-19
  // Denna hårdkodade struktur funkar att skicka in och Overlayen visar då dessa!
/*
  let newTestValues = {
    f0: "729",            // New value for Startnumber
    f1: "Alice Anderson", // New value for Fullname
    f2: "OK Clubhouse",   // New value for Club
    f3: "New York"        // New value for Location
  };
  runTemplateUpdate(newTestValues)
*/

  if (forceNewDataUpdateGlob) {
    runTemplateUpdate(extractFieldValues(templateData));
  }
  else {
    runTemplateUpdate(null);
  }  
}

// Example JSON structure
/*
const jsonDataForTest = {
  "item1": [
      { "field": "f0", "ftype": "number", "title": "Number", "value": "444" },
      { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Namn Namnsson" },
      { "field": "f2", "ftype": "textfield", "title": "Club", "value": "OK Tyr" },
      { "field": "f3", "ftype": "textfield", "title": "Location", "value": "NOT USED - REMOVE!!!" },
  ],
  "item2": [
      { "field": "f0", "ftype": "number", "title": "Number", "value": "445" },
      { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Kalle Anka" },
      { "field": "f2", "ftype": "textfield", "title": "Club", "value": "OK Ankeborg" },
      { "field": "f3", "ftype": "textfield", "title": "Location", "value": "KALLEFORNIA" },
  ]
};
*/

function findMatchingRunner(startNumber) {
  // Convert startNumber to a string for comparison
  const targetValue = startNumber.toString();

//  let jsonData = jsonDataForTest;
// FIXME: Why is this Global empty ??????????
//  const jsonData = window.TyrAppGlobals.jsonRunnerInfoData;

  const jsonData = {
    "item1": [
        { "field": "f0", "ftype": "number", "title": "Number", "value": "444" },
        { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Namn Namnsson" },
        { "field": "f2", "ftype": "textfield", "title": "Club", "value": "OK Tyr" },
        { "field": "f3", "ftype": "textfield", "title": "Location", "value": "NOT USED - REMOVE!!!" },
    ],
    "item2": [
        { "field": "f0", "ftype": "number", "title": "Number", "value": "445" },
        { "field": "f1", "ftype": "textfield", "title": "Fullname", "value": "Kalle Anka" },
        { "field": "f2", "ftype": "textfield", "title": "Club", "value": "OK Ankeborg" },
        { "field": "f3", "ftype": "textfield", "title": "Location", "value": "KALLEFORNIA" },
    ]
  };

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
                  // itemKey is the key (like "item11") of the matching item.
                  return { itemKey, obj }; // Return the matching item key and its FIRST item object ONLY (f0)
              }
          }
      }
  }

  // Return null if no match is found
  return null;
}

/**
 * Retrieves the full item data for a runner based on the given startNumber.
 * It first calls findMatchingRunner(startNumber) to get the matching item's key,
 * then returns an object mapping each field id to its value for fields with ftype 
 * "number" or "textfield".
 *
 * @param {number} startNumber - The start number to search for.
 * @returns {object | null} An object with key:value pairs for matching fields, or null if not found.
 */
function getFullRunnerData(startNumber) {
  // Use the existing function to find the matching runner (item key and its FIRST item object ONLY)
  const matching = findMatchingRunner(startNumber);
  if (matching === null) {
    console.warn("No runner found with start number:", startNumber);
    return null;
  }

  // Retrieve the full array from whole JSON structure for the item keyed by matching.itemKey
/*
  const fullItem = jsonDataForTest[matching.itemKey];
*/

  const fullItem = window.TyrAppGlobals.jsonRunnerInfoData[matching.itemKey];
  
  // Transform the array into an object mapping each field id to its value,
  // but only for editable fields with ftype "number" or "textfield".
  const filteredData = {};
  fullItem.forEach(fieldObj => {
    if (fieldObj.ftype === "number" || fieldObj.ftype === "textfield") {
      filteredData[fieldObj.field] = fieldObj.value;
    }
  });

  return filteredData;
}


// NEW FUNCTION 2025-04-20
// Performance: Retrieving items is efficient since JSON objects are accessed via direct keys.
function getItemByStartNumber(startNumber) {
  // Ensure jsonRunnerInfoData is defined and contains the required data
  if (window.TyrAppGlobals && window.TyrAppGlobals.jsonRunnerInfoData) {
      const itemKey = `item${startNumber}`; // Build the item key, e.g., "item1", "item2"
      const itemData = window.TyrAppGlobals.jsonRunnerInfoData[itemKey];
      
      if (itemData) {
          console.log(`Retrieved data for ${itemKey}:`, itemData);
          return itemData; // Return the specific item's data
      } else {
          console.error(`Item with startNumber ${startNumber} does not exist.`);
          return null; // Return null if the item doesn't exist
      }
  } else {
      console.error("jsonRunnerInfoData is not initialized or does not exist.");
      return null; // Return null if jsonRunnerInfoData is undefined
  }
}

// Example usage:
// Assume that in jsonDataForTest, item11's f0 has value "111" (as a string)
// with additional fields, for example:
/*
  "item11": [
      { "field": "f0", "ftype": "number",    "title": "Number",    "value": "111" },
      { "field": "f1", "ftype": "textfield", "title": "Fullname",  "value": "Elva Elvenius" },
      { "field": "f2", "ftype": "textfield", "title": "Club",      "value": "OK Tyr" },
      { "field": "f3", "ftype": "textfield", "title": "Location",  "value": "" },
      { "field": "f4", "ftype": "textfield", "title": "Class",     "value": "D21" },
      { "field": "f5", "ftype": "textfield", "title": "Starttime", "value": "11:00" }
  ]
*/

// This getRunnerData function is triggered by extra button 'Get Runners'!

// Custom Controls Button event handler
function getRunner() {
  //alert('getRunner() CALLED!'); //OK ALSO WITH EVENT HANDLER IN /templates/oktyr/.../js/spx_interface.js folder!

  // Note: The prompt() function only works in client browsers, not in Node.js server-side!
  let input = prompt("Ange nummerlapps-nummer (1-999):", "0");
  if (input !== null) {
    let input_number = NaN;        
    try {
        input_number = parseInt(input); 
    }
    catch {
        console.error("Invalid number entered. Failed to parse as Int");
    }       
    
    if (!isNaN(input_number)) {
        console.log("The number entered is:", input_number); // OK SO FAR!

        //window.TyrAppGlobals.startNumber = input_number;
        selectedStartNumberGlob = input_number;

        // Initiate the fetching of runner data from here...
//        let runnerDataToUpdate = getFullRunnerData(input_number);

        // NEW FUNCTION CALL 2025-04-20
        // Retrieve specific runner data item
        let runnerDataToUpdate = getItemByStartNumber(input_number);

        if (runnerDataToUpdate !== null) {
          console.log("Retrieved runner data to update:", runnerDataToUpdate);

          //TODO:
          // Update the hidden data fields.
          // Uncaught TypeError: Cannot set properties of null (setting 'textContent')
          /*
          document.getElementById("f0").textContent = "1234567890"; //newValues.f0;
          document.getElementById("f1").textContent = "NYTT NAMN FRÅN KODEN"; //newValues.f1;
          document.getElementById("f2").textContent = "DEN NYA KLUBBEN"; //newValues.f2;
          document.getElementById("f3").textContent = "LOCATION should be removed?"; //newValues.f3;
          */

          // Define the new TEST values you want to set.
          /*
          let newTestValues = {
            f0: "729",            // New value for Startnumber
            f1: "Alice Anderson", // New value for Fullname
            f2: "OK Clubhouse",   // New value for Club
            f3: "New York"        // New value for Location
          };
          */

          // Access using dot notation
          //console.log(newTestValues.f2); // Outputs: OK Clubhouse

          // Or access using bracket notation
          //console.log(newTestValues["f2"]); // Outputs: OK Clubhouse

          // NEW TEST 2025-04-18 (fm)
    //      runnerDataToUpdate = newTestValues;

          // TODO NEW TEST 2025-04-18 (em)?:
          // Set ALL fields also "ftype" : "number", "title" : "Startnumber", etc.

          if (isEmptyJson(runnerDataToUpdate)) {
            console.warn('runnerDataToUpdate IS EMPTY!!!');
            alert('runnerDataToUpdate IS EMPTY!!!');
            return; //--------------------------------------- RETURN !!!!!
          }

          console.log('Updated runnerDataToUpdate, size: ', getJsonSize(runnerDataToUpdate));

          // TODO?:
          // PERTTI TEST 2025-04-18 (em):
//          updateGlobalTemplateValues(runnerDataToUpdate);

          if (checkWindowTyrAppGlobals()) {
            // PERTTI TEST:
            // IDEA: Maybe I should have a global to store the newData I want to force push to editor + overlay?
            window.TyrAppGlobals.jsonRunnerForcedPushData = runnerDataToUpdate;
            console.log("Updated jsonRunnerForcedPushData, size:", getJsonSize(window.TyrAppGlobals.jsonRunnerForcedPushData));
            forceNewDataUpdateGlob = true;
          }          

          // PERTTI TEST 2025-04-18 (fm):
          forceEditorFieldsUpdate(runnerDataToUpdate);

          // TODO: As fallback or would it work better than using the window.TyrAppGlobals even?
      //    runnerDataToUpdateGlob = runnerDataToUpdate;

          // FIXME:          
          // and by a flag 'forceNewDataUpdateGlob' in update() use that data instead of the data sent from the SPX Layers?       

        // IMPORTANT: runTemplateUpdate() call should be done LAST after an update of input field values! 
        // - preferrably last in update() function, triggered by playLayer or updateLayer.        
      }
    } 
    else {
        console.log("Invalid number entered. Please try another number (1-999)");
        alert('Numret var felaktigt. Försök med annat nummer (1-999)');          
        // We keep the previous start number?
    } // end isNaN check
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

// Encoded HTML to plain text
// Any HTML-encoded parts in the input string are decoded, and the function returns the plain text.
function htmlDecode(txt) {
  var doc = new DOMParser().parseFromString(txt, "text/html");
  return doc.documentElement.textContent;
}

// Utility function
// Provides a safe way to obtain a reference to a DOM element.
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

// TODO: Use this function???
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
  // Check if window.TyrAppGlobals is defined and is an object with required properties
  if (!window.TyrAppGlobals) { 
    console.error('window.TyrAppGlobals is not defined');
    return false;
  }
  if (!window.TyrAppGlobals.jsonRunnerInfoData || 
      typeof window.TyrAppGlobals.jsonRunnerInfoData !== 'object' || 
      window.TyrAppGlobals.jsonRunnerInfoData === null) {
    console.error('window.TyrAppGlobals.jsonRunnerInfoData is not defined or not an object or is null');
    return false;
  }
  if (!window.TyrAppGlobals.jsonRunnerForcedPushData || 
      typeof window.TyrAppGlobals.jsonRunnerForcedPushData !== 'object' ||
      window.TyrAppGlobals.jsonRunnerForcedPushData == null) {
    console.error('window.TyrAppGlobals.jsonRunnerForcedPushData is not defined or not an object');
    return false;
  }
  return true;
}