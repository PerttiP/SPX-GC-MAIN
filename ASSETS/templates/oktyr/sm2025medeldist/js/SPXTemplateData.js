/**
    A JavaScript class (using a constructor function) to “type‐define” the shape of SPX Template Data.

    Purpose:
        Used by splitTime.html and spx_interface.js for re-updating
        SPX Template Data in the update() function, called by PlayLayer and UpdateLayer.

    Requirements:
        The DataFields array of window.SPXGCTemplateDefinition must have the following fields:
          comment,
          f_list_titel,
          f_vald_klass,
          f_vald_kontroll,
          f0,
          f1, 
          f2,
          fTemplateType
 */

class SPXTemplateData {
  /*
  constructor({
    comment,
    f_list_titel,
    f_vald_klass,
    f_vald_kontroll,
    ...fields
  }) {
    this.comment = comment;
    // OK Tyr specific fields for UI controls
    this.f_list_titel = f_list_titel;
    this.f_vald_klass = f_vald_klass;
    this.f_vald_kontroll = f_vald_kontroll;

    // Remaining keys are stored in the "fields" object.
    // You might optionally filter to include only keys matching a pattern.
    this.fields = {};
    for (let key in fields) {
      if (/^f\d+$/.test(key)) {
        this.fields[key] = fields[key];
      }
    }
  }
  */

  /**
   * 
   * @param {*} data 
   * Example Parameter templateData = {
      comment: '[ PLACE BIB-NR NAME TIME ]',
      f_list_titel: 'Split',
      f_vald_klass: 'H20',
      f_vald_kontroll: 'RC5',
      f0: '444',
      f1: 'Hälge Hälgesson',
      f2: 'OK Älgen',
      fTemplateType: 'split'
    };
   */
  constructor(data) {
    // Fixed properties (OK Tyr specific fields for UI controls)
    this.comment = data.comment;
    this.f_list_titel = data.f_list_titel;
    this.f_vald_klass = data.f_vald_klass;
    this.f_vald_kontroll = data.f_vald_kontroll;

    // Initialize a dedicated fields property
    /*
      Dedicated Object Approach: 
      Create and populate a separate this.fields object in the constructor, 
      then have getField and updateField operate only on that object.
    */
    this.fields = {};

    for (let key in data) {
      // Check for keys that match pattern "fX" (like f0, f1, f2, etc.)
      if (data.hasOwnProperty(key) && /^f\d+$/.test(key)) {
        this.fields[key] = data[key];
      }
    }
  }

  getField(fieldName) {
    return this.fields[fieldName];
  }

  updateField(field, newValue) {
    if (this.fields.hasOwnProperty(field)) {
      this.fields[field] = newValue;
    } else {
      console.error(`Field "${field}" not found in SPXTemplateData.`);
    }
  }

  // This method goes through relevant fields and updates any DOM element that has its id

  updateDom() {
    // Update fixed properties
    const fixedFields = [
      "comment",
      "f_list_titel",
      "f_vald_klass",
      "f_vald_kontroll",
    ];
    fixedFields.forEach((field) => {
      let element = document.getElementById(field);
      if (element) {
        element.innerText = this[field];
      }
    });

    // Now update the dynamic fields from the dedicated fields object (like f0, f1, f2, etc.)
    if (this.fields) {
      for (let key in this.fields) {
        if (this.fields.hasOwnProperty(key)) {
          let element = document.getElementById(key);
          if (element) {
            element.innerText = this.fields[key];
          }
        }
      }
    }
  }
}

/*
FROM LATEST spx_interface.js and its OLD update function 2025-05-04: before refactoring it:

// If you want to override values for f0, f1, and f2, you can define an object to map the new values:
    const fieldOverrides = {
      f0: apiData.runners[0].bib, // for example replace "9999" with "444"
      f1: apiData.runners[0].name,
      f2: apiData.runners[0].club,
    };

    // Find an element in the DOM with an id matching the key
    // Loop through each field in the templateData object
    for (var dataField in templateData) {
      var idField = document.getElementById(dataField);
      if (idField) {
        // Check if this field should be overridden
        if (fieldOverrides.hasOwnProperty(dataField)) {
          idField.innerText = fieldOverrides[dataField];
          // For debugging, log the changes.
          console.log(
            "Updated element with id:",
            dataField,
            "to",
            idField.innerText
          );
        } else {
          // Otherwise use the value coming in from the templateData
          idField.innerText = templateData[dataField];
        }
      } else {
        switch (dataField) {
          case "comment":
          case "epochID":
          case "fTemplateType":
            console.warn(
              "FYI: Optional #" + dataField + " missing from SPX template..."
            );
            break;
          default:
            console.error(
              "ERROR Placeholder #" + dataField + " missing from SPX template."
            );
        }
      }
    } //end for
*/

// Example usage:
/*
const templateData = {
  comment: '[ PLACE BIB-NR NAME TIME ]',
  f_list_titel: 'Split',
  f_vald_klass: 'H20',
  f_vald_kontroll: 'RC5',
  f0: '444',
  f1: 'Hälge Hälgesson',
  f2: 'OK Älgen',
  fTemplateType: 'split'
};
*/

/*
const spxData = new SPXTemplateData(templateData);
console.log(spxData.comment);            // "[ PLACE BIB-NR NAME TIME ]"
console.log(spxData.fields.f1);          // "Hälge Hälgesson"
*/
