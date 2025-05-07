/**
 * Fetches the runners and split information from the API and maps it
 * into a client-side structure.
 *
 * @param {string} apiUrl - The URL for the API endpoint.
 * @param {string} competition - The competitive event name, e.g., "SM Medel Kval".
 * @param {string} runnerClass - The competition class, e.g., "D21".
 *                              (This will be sent as key "class" to the API.)
 * @param {number} splitId - The ID for the split.
 * @returns {Promise<Object>} An object structured with metadata and a nested split object.
 */
async function fetchRunnersSplitData(
  apiUrl,
  competition,
  runnerClass,
  splitId
) {
  // Create the payload with the keys expected by the API.
  // Note: The API is expecting the key "class", therefore we pass runnerClass as that.
  const requestData = {
    competition: competition,
    class: runnerClass,
    splitId: splitId,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST", // Change to GET and adjust payload as needed if your API expects GET.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Network response error: ${response.status}`);
    }

    // Parse the API response.
    const data = await response.json();

    // The API returns an object structured as follows:
    // {
    //   competition: "SM Medel Kval",
    //   class: "D21",
    //   split: {
    //     id: 150,
    //     name: "Radio 2,9 km",
    //     runners: [ { team: null, bib: "144", name: "Eva Rådberg", club: "OK Tyr", start_time: 745900, split_time: 753878 }, ... ]
    //   }
    // }
    //
    // We map the "class" property to "runner_class", so that our final structure is:
    const apiSplitData = {
      competition: data.competition,
      runner_class: data["class"], // renaming "class" to "runner_class"
      split: {
        id: data.split.id,
        name: data.split.name,
        runners: data.split.runners,
      },
    };

    // Return the transformed data.
    return apiSplitData;
  } catch (error) {
    console.error("Error fetching runners split data:", error);
    throw error;
  }
}
