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

/*
!!!!!!!!!

IMPORTANT:

!!!!!!!!!

If this file is put into the body section of the HTML it will ALWAYS be run EVERY TIME the page (DOM) is reloaded!!!

*/

let stopWatch;

//window.myStopWatch; // Not needed?

// NEW BETTER WAY TO DO THIS?
document.addEventListener("DOMContentLoaded", function () {
  console.log("!!!! DOM content loaded (spx_interface) !!!! ");

  // Grab a reference to the container DOM element.
  const stopWatchEl = document.getElementById("stopwatch");
  if (!stopWatchEl) {
    console.error("Could not get container element stopwatch from DOM");
    return;
  }

  // Instantiate the stopwatch using the global class.
  // You can now use the fully qualified window.LW_TyrStopWatch globally.
  stopWatch = new window.LW_TyrStopWatch();

  // Start the stopwatch (this calls reset() and then start())
  stopWatch.show(stopWatchEl);
  console.log("Stopwatch was started");
});

// OLD WAY TO DO THIS (not the best way?):
// Attach the TyrStopWatch class to the global object as LW_TyrStopWatch (if not already attached)
/*
if (typeof window !== "undefined") {
  // NOTE: Already attached in static\js\lib\tyrstopwatch.js !!!
  if (window.LW_TyrStopWatch) {
    console.debug(
      "window.LW_TyrStopWatch was already attached to global window object!"
    );
  } else {
    window.LW_TyrStopWatch = TyrStopWatch;
  }

  // Instantiate the stopwatch (ONLY ONCE!)
  if (!localStorage.getItem("hasStopWatchBeenInstantiated_3")) {
    stopWatch = new window.LW_TyrStopWatch();
    if (window.myStopWatch) {
      console.warn(
        "STRANGE BEHAVIOR: window.LW_TyrStopWatch was already instantiated and attached to global window object!!!"
      );
    } else {
      window.myStopWatch = stopWatch;
      console.debug("A new window.LW_TyrStopWatch was instantiated!");
    }

    localStorage.setItem("hasStopWatchBeenInstantiated_3", "true");
  }
}
*/

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

  if (typeof runTemplateUpdate === "function") {
    stopWatch.preset(144, true); // auto-resume from preset

    runTemplateUpdate(); // Play will follow
  } else {
    console.error("runTemplateUpdate() function missing from SPX template.");
  }
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

  // Example: Preset the stopwatch to 119 seconds and auto-resume
  //  stopWatch.preset(119, true);

  // Example of pause/resume usage after a delay
  setTimeout(function () {
    stopWatch.pause();
    console.log("Stopwatch paused after 5 seconds.");
  }, 5000);

  setTimeout(function () {
    stopWatch.resume();
    console.log("Stopwatch resumed after pause of 3 seconds.");
  }, 8000);

  setTimeout(function () {
    stopWatch.stop();
    console.log("Stopwatch stopped after it was resumed 5 seconds ago.");
  }, 13000);

  setTimeout(function () {
    stopWatch.preset(839, true); // auto-resume from preset
    console.log("Stopwatch preset now set to 839 seconds");
  }, 18000);

  if (typeof runAnimationIN === "function") {
    runAnimationIN(stopWatch);
  } else {
    console.error("runAnimationIN() function missing from SPX template.");
  }
}

function stop() {
  if (typeof runAnimationOUT === "function") {
    runAnimationOUT(stopWatch);
  } else {
    console.error("runAnimationOUT() function missing from SPX template.");
  }
}
