// Global Window variables
// ----------------------------------------------------
// Access these as TyrAppGlobals.startNumber in HTML/JS
// IT IS A FAST HACK (YES IT IS BAD I KNOW)


console.log('!!!! NOTE: This init_global_data.js script MUST EXECUTE FIRST !!!!');

// ----------------------------------------------------------------

// If window.TyrAppGlobals does not exist (is undefined or null), 
// it assigns an empty object {} to it.

//FIXME:
// EITHER Use the short-circuit assignment
//window.TyrAppGlobals = window.TyrAppGlobals || {};

// OR
if (typeof window.TyrAppGlobals === 'undefined' || window.TyrAppGlobals === undefined) {
    window.TyrAppGlobals = {};
}

// Initialize SPXGCTemplateDefinition if it doesn't exist
if (window.SPXGCTemplateDefinition === undefined) {
    window.SPXGCTemplateDefinition = {};
}  
/*
if (window.TyrAppGlobals.startNumber === undefined) {
    window.TyrAppGlobals.startNumber = 0;
}
*/

if (window.TyrAppGlobals.jsonRunnerInfoData === undefined) {
    window.TyrAppGlobals.jsonRunnerInfoData = {}; // This will hold the fetched JSON data
}

if (window.TyrAppGlobals.jsonRunnerForcedPushData === undefined) {
    window.TyrAppGlobals.jsonRunnerForcedPushData = {}; // This will hold the fetched JSON data for editor and overlay
}

// ----------------------------------------------------------------

console.log('!!!! Now init_global_data.js script has FINISHED !!!!');