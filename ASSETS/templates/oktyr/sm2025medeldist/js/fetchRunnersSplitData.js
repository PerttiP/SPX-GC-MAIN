/**
 * Fetches runners and split information from the API using a GET request.
 *
 * The API expects the following query parameters:
 * - competition: The name of the competition (e.g., "SM Medel Kval").
 * - class: The competition class (e.g., "D21").
 * - splitId: The split ID (e.g., 150).
 *
 * The API response is expected to have this structure:
 *
 * {
 *   "competition": "SM Medel Kval",
 *   "class": "D21",
 *   "split": {
 *     "id": 150,
 *     "name": "Radio 2,9 km",
 *     "runners": [
 *       {
 *         "team": null,
 *         "bib": "144",
 *         "name": "Eva Rådberg",
 *         "club": "OK Tyr",
 *         "start_time": 745900,
 *         "split_time": 753878
 *       },
 *       ...
 *     ]
 *   }
 * }
 *
 * On the client-side, we remap "class" to "runner_class" so that our final structure is:
 *
 * {
 *   competition: "SM Medel Kval",
 *   runner_class: "D21",
 *   split: {
 *     id: 150,
 *     name: "Radio 2,9 km",
 *     runners: [ ... ]
 *   }
 * }
 *
 * @param {string} apiUrl - The URL for the API endpoint.
 * @param {string} competition - The competition name.
 * @param {string} runnerClass - The competition class.
 * @param {number} splitId - The ID for the split.
 * @returns {Promise<Object>} The transformed API response.
 */
async function fetchRunnersSplitData(
  apiUrl,
  competition,
  runnerClass,
  splitId
) {
  // Construct the URL with query parameters.
  // Here we add competition, class, and splitId.
  const url = new URL(apiUrl);
  url.searchParams.append("competition", competition);
  url.searchParams.append("class", runnerClass); // The API expects "class"
  url.searchParams.append("splitId", splitId.toString());

  try {
    // Send the GET request.
    const response = await fetch(url, { method: "GET" });

    // Check if the response is ok (status in the range 200-299)
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
      throw new Error(`Network response error: ${response.status}`);
    }

    // Parse the JSON response.
    const data = await response.json();

    // Map the API response to our client-side structure.
    // We remap "class" to "runner_class" to avoid using a reserved keyword.
    const apiSplitData = {
      competition: data.competition,
      runner_class: data["class"],
      split: {
        id: data.split.id,
        name: data.split.name,
        runners: data.split.runners,
      },
    };

    return apiSplitData;
  } catch (error) {
    console.error("Error fetching runners split data:", error);
    throw error;
  }
}

// Example usage:
/*
fetchRunnersSplitData(
  "https://your-api-endpoint.com/getSplit",
  "SM Medel Kval",
  "D21",
  150
)
  .then((apiSplitData) => {
    console.log("Fetched API Data:", apiSplitData);
    // You can now use `apiSplitData` to update your UI or process further.
  })
  .catch((error) => {
    // Handle errors as appropriate.
    console.error("Fetch failed:", error);
  });
*/
