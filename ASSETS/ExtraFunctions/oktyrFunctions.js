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

function getRunner() {
    //alert('getRunner() CALLED!');

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
            //getRunnerData(number);
            window.TyrAppGlobals.getRunnerData(number);

        } else {
            console.log("Invalid number entered. Please add another number (1-999)");
            alert('Numret var felaktigt. Försök med annat nummer (1-999)');
            //FIXME:
            //Should we keep the previous start number?
        }
    }
}