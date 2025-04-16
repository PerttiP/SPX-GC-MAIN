// --------------------------------------------------------------
// OK Tyr custom functions for project/global extras.
// --------------------------------------------------------------

// Global Window variables
// ----------------------------------------------------
// Access these as TyrAppGlobals.startNumber in HTML/JS
// IT IS A FAST HACK (YES IT IS BAD I KNOW)

// If window.TyrAppGlobals does not exist (is undefined or null), 
// it assigns an empty object {} to it.
window.TyrAppGlobals = window.TyrAppGlobals || {};
if (window.TyrAppGlobals.startNumber === undefined) {
  window.TyrAppGlobals.startNumber = 0;
}
// Assign the function getRunner to window.TyrAppGlobals
if (window.TyrAppGlobals.getRunnerData === undefined) {
    window.TyrAppGlobals.getRunnerData = getRunner;
}

// ----------------------------------------------------

//FIXME?:
// Seems that there are hard coded refs to 'demoFunctions.js' in the server side code?

// Handler function defined in SPX Project Extras - Function Library:
// 'demo_popup('Hello world!')'
function demo_popup(message) {
    // A basic hello world example
    alert('A basic example of a custom function.\nThe text given as function argument was:\n\n' + message)
} // demo_popup


// ----------------------
// OK Tyr extra functions
// ----------------------

function SPX_UI_popup(message) {
    // A basic message to OPERATOR in SPX UI
    alert(message);
}