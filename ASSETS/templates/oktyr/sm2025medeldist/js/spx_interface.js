// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------

//
//  Ensure spx_interface.js is responsible for all DOM updates and interactions with window.SPXGCTemplateDefinition.
//

// 2025-04-18 18:00: MOVED ALL GLOBALS to init_global_data.js and LOADED ON TOP in HTML head !!!

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


// PERTTI TEST 2025-04-18 (fm):
function updateForcedPush(newData) {
  console.log(typeof newData); 
  if (typeof newData !== 'object') {
    console.error("updateForcedPush: newData must be an object!");
     // TODO?: If it's a string, attempt to parse it as JSON
     return;
  }

  console.log('updateForcedPush: newData:'); 
  console.log(newData);

  checkWindowTyrAppGlobals();

  // Push data to template fields (borrowed from Two-Tones template pack)
  // If an object is passed, use it directly
  const jsonData = newData;
  window.TyrAppGlobals.jsonRunnerForcedPushData = jsonData; //newData;

  console.log('getJsonSize(jsonRunnerForcedPushData from Globals (uFP)): ', getJsonSize(window.TyrAppGlobals.jsonRunnerForcedPushData));

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

  console.log('getJsonSize(jsonRunnerForcedPushData from Globals (upd)): ', getJsonSize(window.TyrAppGlobals.jsonRunnerForcedPushData));

  let templateData;
  if (!isEmptyJson(window.TyrAppGlobals.jsonRunnerForcedPushData)) {
    console.log('----- jsonRunnerForcedPushData!');
    templateData = window.TyrAppGlobals.jsonRunnerForcedPushData;
  }
  else {
    console.log('Original code flow for update');
    templateData = JSON.parse(data);
  }  

  // PERTTI DESP TEST:
//  templateData = window.TyrAppGlobals.jsonRunnerForcedPushData; // WILL NOT BE DONE HERE
  console.log('----- Update handler called, using data:', templateData);

  let templateDataSize = getJsonSize(templateData);
  console.log('getJsonSize(templateData): ', templateDataSize);  

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

  let newTestValues = {
    f0: "729",            // New value for Startnumber
    f1: "Alice Anderson", // New value for Fullname
    f2: "OK Clubhouse",   // New value for Club
    f3: "New York"        // New value for Location
  };

  runTemplateUpdate(newTestValues)
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
  // Check if window.TyrAppGlobals.jsonRunnerInfoData is defined and is an object
  if (!window.TyrAppGlobals) { 
    console.error('window.TyrAppGlobals is not defined');
    return false;
  }
  if (!window.TyrAppGlobals.jsonRunnerInfoData || typeof window.TyrAppGlobals.jsonRunnerInfoData !== 'object') {  
    console.error('window.TyrAppGlobals.jsonRunnerInfoData is not defined or not an object');
    return false;
  }
  if (!window.TyrAppGlobals.jsonRunnerForcedPushData || typeof window.TyrAppGlobals.jsonRunnerForcedPushData !== 'object') {
    console.error('window.TyrAppGlobals.jsonRunnerForcedPushData is not defined or not an object');
    return false;
  }
  return true;
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


        //FIXME:
        // Uncaught TypeError: Cannot set properties of undefined (setting 'startNumber')

        window.TyrAppGlobals.startNumber = input_number;

        // Initiate the fetching of runner data from here...
        let runnerDataToUpdate = getFullRunnerData(input_number);

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
          let newTestValues = {
            f0: "729",            // New value for Startnumber
            f1: "Alice Anderson", // New value for Fullname
            f2: "OK Clubhouse",   // New value for Club
            f3: "New York"        // New value for Location
          };

          // Access using dot notation
          console.log(newTestValues.f2); // Outputs: OK Clubhouse

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

          testSize = getJsonSize(runnerDataToUpdate);
          console.log('getJsonSize(runnerDataToUpdate): ', testSize);

          // PERTTI TEST 2025-04-18 (em):
          updateGlobalTemplateValues(runnerDataToUpdate);

          checkWindowTyrAppGlobals();

          // PERTT TEST:
          window.TyrAppGlobals.jsonRunnerForcedPushData = runnerDataToUpdate;

          // PERTTI TEST 2025-04-18 (fm):
          updateForcedPush(runnerDataToUpdate);

          // FIXME:
          // IDEA: Maybe I should have a global to store the newData I want to force push to editor + overlay
          // and by a flag 'forceNewDataUpdate' in update() use that data instead of the data sent from the SPX Layers?

          // Update the hidden data fields, using value
          // Uncaught TypeError: Cannot set properties of null (setting 'value')
          /* FIXME: MOVE TO HTML -> runTemplateUpdate()!!!??? */

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

          // Update visible overlay elements if needed:
          // For example, if your overlay uses IDs "startnumber", "text1", etc.      
          /* FIXME: MOVE TO HTML -> runTemplateUpdate()!!!??? */

          /*
          let el = document.getElementById("startnumber"); 
          if (el) { // If the element is found
            el.textContent = runnerDataToUpdate.f0 || ""; 
          }
          el = document.getElementById("text1"); 
          if (el) { 
            el.textContent = runnerDataToUpdate.f1 || ""; 
          }
          el = document.getElementById("text2"); 
          if (el) { 
            el.textContent = runnerDataToUpdate.f2 || ""; 
          }
          el = document.getElementById("text3"); 
          if (el) { 
            el.textContent = runnerDataToUpdate.f3 || ""; 
          }         
          */

// Should be done LAST during an update of input field values! 
// - preferrably last in update() function, triggered by playLayer or updateLayer.
// IDEA: Maybe I should have a global to store the newData I want to force push to editor + overlay
// and by a flag 'forceNewDataUpdate' in update() use that data instead of the data sent from the SPX Layers?
/*
          console.log('NOW CALLING runTemplateUpdate() - Play will follow?');

          // Once DOM updated we can initPageData and run animations... ???
          if (typeof runTemplateUpdate === "function") { 
            runTemplateUpdate() // Play will follow
          } else {
            console.error('runTemplateUpdate() function missing from SPX template.')
          }
*/

      }

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
