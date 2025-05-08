/**
 * Fetch specific runner from API Endpoint
 * @param {*} apiUrl
 * @param {*} runnerClass
 * @param {*} bibNbr
 * @returns
 */
async function fetchSpecificRunnerData(runnerClass, bibNbr) {
  // Construct the full URL according to the endpoint:
  // /api/{competition}/{class}/runners/{bib}

  // http://85.24.189.92:5000/api/10/1/runners/102

  //FIXME: mapping of API key -> runner_class

  const apiUrl = "http://85.24.189.92:5000/api/10/1/runners/102";

  const fullUrl = `${apiUrl}/${runnerClass}/runners/${bibNbr}`;

  try {
    //const response = await fetch(fullUrl, {
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      if (!response.ok) {
        let friendlyMessage;
        switch (response.status) {
          case 404:
            friendlyMessage =
              "The requested data was not found. Please check your selection and try again.";
            break;

          case 500:
            friendlyMessage =
              "Our server encountered an error. Please try again later or contact support.";
            break;
          default:
            friendlyMessage = `An unexpected error occurred (Error code: ${response.status}). Please try again.`;
        }
        alert(friendlyMessage);
        // Throw a new error with this operator-friendly message.
        throw new Error(friendlyMessage);
      }
    }

    // Parse and return the JSON response.
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching specific runner data:", error);
    throw error;
  }
}

// Usage example:
/*
  fetchSpecificRunnerData("/api/MeOS%20Tredagars,%20etapp%201", "H21", 102)
    .then((apiData) => {
      console.log("Specific Runner Data:", apiData);
      // Further processing here...
    })
    .catch((error) => {
      console.error("Error fetching API response:", error);
    });
  */
