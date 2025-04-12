
// This is a generic BASIC command handler
// between SPX and the template. See other
// SPX templates for more advanced functionality
// such as Update() etc..


function update(data) {
    // Push data to template fields
    const jsonData = JSON.parse(data)
    for (var field in jsonData) {
        if (document.getElementById(field)) {
            let value = jsonData[field]
            if ( value == "null" || value == "undefined" ) value = "";
            document.getElementById(field).innerHTML = value
        }
    }
}


function play() {
    // Execute animation in
    runAnimationIN()
}

function stop() {
    // Execute animation out
    runAnimationOUT()
}


