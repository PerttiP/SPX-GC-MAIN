// --------------------------------------------------------------
// OK Tyr custom functions for project/global extras.
// --------------------------------------------------------------

//FIXME?:
// Seems that there are hard coded refs to 'demoFunctions.js' in the server side code?

// Handler function defined in SPX Project Extras - Function Library:
// 'demo_popup('Hello world!')'
function demo_popup(message) {
    // A basic hello world example
    alert('A basic example of a custom function.\nThe text given as function argument was:\n\n' + message)
} // demo_popup

function SPX_UI_popup(message) {
    // A basic message to OPERATOR in SPX UI
    alert(message);
}

function getRunner() {
    alert('getRunner() CALLED!');

}