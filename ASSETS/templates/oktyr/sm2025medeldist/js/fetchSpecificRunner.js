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
      // If the response has a non-OK status, throw an error to be caught below.
      throw new Error(`HTTP error! Status: ${response.status}`);
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
