// This is a generic BASIC command handler
// between SPX and the template. See other
// SPX templates for more advanced functionality
// such as Update() etc..

// Define the values for your POST payload:
const projectName = "SPX_API_TEST";
const fileName = "myRundownFile"; // e.g., name without the .json extension
const content = {
  // content must be an object
  // Ensure you include a 'templates' array that is not empty.
  templates: [
    {
      relpath: "templates/myTemplate.html", // Required for each template
      DataFields: [
        // Populate with the required fields (must be non-empty)
        { field: "f0", value: "Value for f0" },
        { field: "f1", value: "Value for f1" },
        { field: "f2", value: "Value for f2" },
        // Additional DataFields if needed
      ],
      // Provide default values for other expected properties
      playserver: "OVERLAY",
      playchannel: "1",
      playlayer: "5",
      webplayout: "5",
      // These may be overridden later by the API if needed.
      description: "Default description",
    },
  ],
};

// Make the POST request to /rundown/json
fetch("/rundown/json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // If your API key is passed in a header, include it here, e.g.:
    // 'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    project: projectName,
    file: fileName,
    content: content,
  }),
})
  .then((response) => {
    if (!response.ok) {
      // Handle non-200 HTTP responses
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Success:", data);
    // You can handle the returned info message here.
  })
  .catch((error) => {
    console.error("Error:", error);
    // You can display an error alert or a message in the UI.
  });

function update(data) {
  // Push data to template fields
  const jsonData = JSON.parse(data);
  for (var field in jsonData) {
    if (document.getElementById(field)) {
      let value = jsonData[field];
      if (value == "null" || value == "undefined") value = "";
      document.getElementById(field).innerHTML = value;
    }
  }
}

function play() {
  // Execute animation in
  runAnimationIN();
}

function stop() {
  // Execute animation out
  runAnimationOUT();
}
