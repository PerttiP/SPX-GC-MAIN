
// Handler function defined in SPX Project Extras - Function Library:

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
                getRunner(input_number);
            }
            else {
                console.log("Invalid number entered. Please try another number (1-999)");
                alert('Numret var felaktigt. Försök med annat nummer (1-999)');          
                // We keep the previous start number?
        } // end isNaN-check
    }
}



