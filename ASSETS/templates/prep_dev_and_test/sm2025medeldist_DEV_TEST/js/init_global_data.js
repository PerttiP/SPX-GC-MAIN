// Global Window variables
// ----------------------------------------------------
// Access these as TyrAppGlobals.startNumber in HTML/JS
// IT IS A FAST HACK (YES IT IS BAD I KNOW)

const jsonRunnerInfoDataGlob = {
    item1: [ // In JavaScript object literals, you can omit the quotes for keys if they follow valid identifier rules:
        { field: "f0", ftype: "number", title: "Number", value: "111" },
        { field: "f1", ftype: "textfield", title: "Fullname", value: "Elva Elvenius" },
        { field: "f2", ftype: "textfield", title: "Club", value: "OK Tyr" },
        { field: "f3", ftype: "textfield", title: "Location", value: "" },
        { field: "f4", ftype: "textfield", title: "Class", value: "D21" },
        { field: "f5", ftype: "textfield", title: "Starttime", value: "11:00" }
    ],
    item2: [
        { field: "f0", ftype: "number", title: "Number", value: "222" },
        { field: "f1", ftype: "textfield", title: "Fullname", value: "Sidan Två" },
        { field: "f2", ftype: "textfield", title: "Club", value: "OK Ankeborg" },
        { field: "f3", ftype: "textfield", title: "Location", value: "" },
        { field: "f4", ftype: "textfield", title: "Class", value: "H21" },
        { field: "f5", ftype: "textfield", title: "Starttime", value: "12:15" }
    ]
};

let jsonRunnerForcedPushDataGlob = {}

console.log('!!!! NOTE: This init_global_data.js script MUST EXECUTE FIRST !!!!');

// ----------------------------------------------------------------

// If window.TyrAppGlobals does not exist (is undefined or null), 
// it assigns an empty object {} to it.

//FIXME:
// EITHER Use the short-circuit assignment
//window.TyrAppGlobals = window.TyrAppGlobals || {};

// OR
/*
if (typeof window.TyrAppGlobals === 'undefined' || window.TyrAppGlobals === undefined) {
    window.TyrAppGlobals = {};
}
*/

// Initialize SPXGCTemplateDefinition if it doesn't exist
if (typeof window.SPXGCTemplateDefinition === 'undefined' || window.SPXGCTemplateDefinition === undefined) {
    window.SPXGCTemplateDefinition = {};
}  

/*
if (window.TyrAppGlobals.startNumber === undefined) {
    window.TyrAppGlobals.startNumber = 0;
}
*/

/*
if (typeof window.TyrAppGlobals.jsonRunnerInfoData === 'undefined' || window.TyrAppGlobals.jsonRunnerInfoData === undefined) {
    window.TyrAppGlobals.jsonRunnerInfoData = {}; // This will hold all the fetched JSON data
}

if (typeof window.TyrAppGlobals.jsonRunnerForcedPushData === 'undefined' || window.TyrAppGlobals.jsonRunnerForcedPushData === undefined) {
    window.TyrAppGlobals.jsonRunnerForcedPushData = {}; // This will hold the fetched JSON data for editor and overlay
}
*/

/*
window.TyrAppGlobals = {
    jsonRunnerInfoData: { },
    jsonRunnerForcedPushData: { }
};
*/

// Set new data to the jsonRunnerInfoData property (NOTE: typeof MUST BE 'object')
/*
window.TyrAppGlobals.jsonRunnerInfoData = {
    item1: [ // In JavaScript object literals, you can omit the quotes for keys if they follow valid identifier rules:
        { field: "f0", ftype: "number", title: "Number", value: "111" },
        { field: "f1", ftype: "textfield", title: "Fullname", value: "Elva Elvenius" },
        { field: "f2", ftype: "textfield", title: "Club", value: "OK Tyr" },
        { field: "f3", ftype: "textfield", title: "Location", value: "" },
        { field: "f4", ftype: "textfield", title: "Class", value: "D21" },
        { field: "f5", ftype: "textfield", title: "Starttime", value: "11:00" }
    ],
    item2: [
        { field: "f0", ftype: "number", title: "Number", value: "222" },
        { field: "f1", ftype: "textfield", title: "Fullname", value: "Sidan Två" },
        { field: "f2", ftype: "textfield", title: "Club", value: "OK Ankeborg" },
        { field: "f3", ftype: "textfield", title: "Location", value: "" },
        { field: "f4", ftype: "textfield", title: "Class", value: "H21" },
        { field: "f5", ftype: "textfield", title: "Starttime", value: "12:15" }
    ]
};

console.log("Updated jsonRunnerInfoData:", window.MyAppData.jsonRunnerInfoData);
*/

// ----------------------------------------------------------------

console.log('!!!! Now init_global_data.js script has FINISHED !!!!');