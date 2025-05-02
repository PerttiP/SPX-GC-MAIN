// This is a generic BASIC command handler
// between SPX and the template. See other
// SPX templates for more advanced functionality
// such as Update() etc..

// Attach the TyrClock class to the global object as LW_TyrClock (if not already attached)
/*
if (typeof window !== "undefined") {
  if (window.LW_TyrClock) {
    console.debug("window.LW_TyrClock is attached to global window object!");
  } else {
    window.LW_TyrClock = TyrClock;
  }
}
*/

// Attach the TyrStopWatch class to the global object as LW_TyrStopWatch (if not already attached)
if (typeof window !== "undefined") {
  if (window.LW_TyrStopWatch) {
    console.debug(
      "window.LW_TyrStopWatch is attached to global window object!"
    );
  } else {
    window.LW_TyrStopWatch = TyrStopWatch;
  }
}

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

  // Since tyrclock.js attached Clock as LW_Clock on the window, you can:
  /*
  const myClock = new window.LW_TyrClock();
  const clockEl = document.getElementById("clock");

  if (clockEl) {
    // Start the clock by displaying it in the chosen element.
    myClock.show(clockEl);
  } else {
    console.debug("clockEl did not get any element by id");
  }
  */
}

function play() {
  /*
  const myClock2 = new window.LW_TyrClock();
  const clockEl2 = document.getElementById("clock2");

  if (clockEl2) {
    // Start the clock by displaying it in the chosen element.
    myClock2.show(clockEl2);
  } else {
    console.debug("clockEl2 did not get any element by id");
  }
*/
  // Instantiate the stopwatch
  const stopWatchEl = document.getElementById("stopwatch");
  const stopWatch = new window.LW_TyrStopWatch();
  stopWatch.show(stopWatchEl);

  // Execute animation in
  runAnimationIN(stopWatch);
}

function stop() {
  // Execute animation out
  runAnimationOUT();
}
