// Class for individual runner data
class Runner {
  constructor(bib, name, startTime, hasTime = 0, splitTime = null, place = 0) {
    this.bib = bib;
    this.name = name;
    this.startTime = startTime;
    this.hasTime = hasTime; // 0 := not passed radio, 1 := has passed radio
    this.splitTime = splitTime; // null until radio was passed
    this.place = place; // 0 until radio was passed
  }
}

// Class for the API response data
class RunnerDataFromAPI {
  constructor(splitId, splitName, runners) {
    this.splitId = splitId;
    this.splitName = splitName;
    this.runners = runners.map(
      (runner) =>
        new Runner(
          runner.bib,
          runner.name,
          runner.startTime,
          runner.hasTime,
          runner.splitTime,
          runner.place
        )
    );
  }

  // Example method to filter runners who have a split time
  getRunnersWithTime() {
    return this.runners.filter((runner) => runner.hasTime === 1);
  }

  // Example method to sort runners by place
  sortRunnersByPlace() {
    return this.runners
      .filter((runner) => runner.place !== null) // Only runners with a defined place
      .sort((a, b) => a.place - b.place);
  }
}

// Example usage:
// Assuming the data from the API is stored in a variable called apiResponse
/*
const apiResponse = {
  split: {
    id: 150,
    name: "Radio 2",
    runners: [
      // The runners data from the API...
    ],
  },
};
*/

// Creating an instance of RunnerDataFromAPI
/*
const runnerData = new RunnerDataFromAPI(
  apiResponse.split.id,
  apiResponse.split.name,
  apiResponse.split.runners
);

// Fetching runners with recorded split times
const runnersWithTime = runnerData.getRunnersWithTime();
console.log("Runners with split times:", runnersWithTime);

// Sorting runners by their placement
const sortedRunners = runnerData.sortRunnersByPlace();
console.log("Sorted runners by place:", sortedRunners);
*/
