// ----------------------------------------------------------------
// (c) Copyright 2021- SPX Graphics (https://spx.graphics)
// ----------------------------------------------------------------


// TEST: Global Window variables
// -----------------------------

//window.TyrApp = {startNumber: 0}; // Access this as TyrApp.startNumber in HTML/JS

// FAST HACK (YES IT IS BAD I KNOW)
// If window.AppGlobals does not exist (is undefined or null), it assigns an empty object {} to it.
window.TyrAppGlobals = window.TyrAppGlobals || {};
if (window.TyrAppGlobals.startNumber === undefined) {
  window.TyrAppGlobals.startNumber = 0;
}


// Receive item data from SPX Graphics Controller (field editor)
// and store values in hidden DOM elements for
// use in the template.

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
      // Pertti: Seems to never enter the else branch?
      switch (dataField) {
        case 'comment':
        case 'epochID':
          // console.warn('FYI: Optional #' + dataField + ' missing from SPX template...');
          break;
          //FIXME: What can these be used for?
          case 'f_list_titel':
            //alert('Update handler with f_list_titel');
            break;
          case 'f_vald_klass':
            //alert('Update handler with f_vald klass');
            break;
        default:
          console.error('ERROR Placeholder #' + dataField + ' missing from SPX template.');
      }
    }
  }

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

// This getRunnerData function is triggered by extra button 'Get Runners'!
function getRunnerData(startNumber) {
  console.log('----- getRunnerData called with startNumber:', startNumber)

  let item = {};
  // Get the ONE and ONLY matching item from jsonRunnerInfoData
  for (const [key, fields] of Object.entries(window.TyrAppGlobals.jsonRunnerInfoData)) {
    const numberField = fields.find(
      field => field.title === "Number" && field.value === startNumber
    );
    if (numberField) {
      item = { key, fields }; // Return the key and the matching item array

      if (item) {
        //FIXME:
        //ALT 1: Is it now we can call update() function above???
        update(item.JSON);

        //ALT2: Or do we need to do sth more???

        // Once DOM updated we can set the fields in the SPX UI template def?
        /*
        if (typeof runTemplateUpdate === "function") { 
          runTemplateUpdate() // Play will follow
        } else {
          console.error('runTemplateUpdate() function missing from SPX template.')
        }
        */
      }
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
