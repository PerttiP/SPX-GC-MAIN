/**
    A JavaScript class (using a constructor function) to “type‐define” the shape of SPX Template Data.

    Purpose:
        Used by splitTime.html and spx_interface.js for re-updating
        SPX Template Data in the update() function, called by PlayLayer an UpdateLayer.
 */

class SPXTemplateData {
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

  // Method example to get a specific field value.
  getField(fieldName) {
    return this.fields[fieldName];
  }
}

// Example usage:
/*
const apiData = {
  comment: '[ PLACE BIB-NR NAME TIME ]',
  f_list_titel: 'Split',
  f_vald_klass: 'H20',
  f_vald_kontroll: 'RC5',
  f0: '444',
  f1: 'Hälge Hälgesson',
  f2: 'OK Älgen',
  f99: './css/themes/News.css'
};
*/

/*
const spxData = new SPXTemplateData(apiData);
console.log(spxData.comment);            // "[ PLACE BIB-NR NAME TIME ]"
console.log(spxData.fields.f1);          // "Hälge Hälgesson"
console.log(spxData.getField('f99'));    // "./css/themes/News.css"
*/
