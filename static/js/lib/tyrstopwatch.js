// VERSION:
// v 1.1    2025-05-05    Pertti:

// UPDATES:
// v 1.1:   Added getState() function.

// tyrStopWatch.js – expanded stopwatch functionality (non‑module version)
//  - with seconds precision and formatted as H:MM.ss
// Based partly on code by Mohammad-karimi with modifications for stopwatch behavior
// from https://github.com/karimi-mohammad/lightweight-clock/blob/main/index.js

/*
Important things to consider 
when instantiating and using this stopwatch from other .js files in a vanilla non‑module JavaScript environment.

The key points are:

1. Load Order: 
Make sure your stopwatch code (the file that defines the class and attaches it to the global window 
as LW_TyrStopWatch) is loaded before any script that will instantiate or use it. 
This is usually handled by the order of <script> tags in your HTML.

2. DOM-Ready Initialization: 
Wrap your instantiation code inside a DOMContentLoaded listener (or place the script right before 
the closing </body> tag) so that the HTML element (the stopwatch container) is available when you call the methods.

3. Global Namespace Access: 
Since your code attaches the class to window.LW_TyrStopWatch, you can simply reference it as such from any other script. 
This way you’re not relying on ES modules or import/export statements.
*/

/*
Extra features (added for OK Tyr)

1. Functions hide() and unhide()

NOTE: Requires the css class 'hiddenClass' specified as:

.hiddenClock {
  display: none !important;
}

2. Function preset(timeInSeconds, autoResume = false)

If autoResume is set to true the watch will start ticking immediately after preset time was set.

3. Function freeze

Freeze time for freezeTimeInSeconds, then resume automatically jumping up the time with freezeTimeInSeconds.

*/

class TyrStopWatch {
  constructor() {
    // The HTML element where the time will be displayed.
    this.clockContainerElement = null;
    // Holds the ID returned by setInterval.
    this.clockUpdateInterval = null;
    // The timestamp (in ms) when the stopwatch was last started or resumed.
    this.startTime = null;
    // The accumulated elapsed time (in ms) from earlier sessions.
    this.elapsedBase = 0;
    /*
        The state of the stopwatch:
          "running" – It’s actively updating the display.
          "paused"  – The display is frozen although the internal elapsed time is still increasing.
          "stopped" – The stopwatch is halted (the interval is cleared); elapsed time is fixed.
      */
    this.state = "stopped";
  }

  getState() {
    return this.state;
  }

  // Returns the current elapsed time (in milliseconds).
  getElapsedTime() {
    if (this.state === "running" || this.state === "paused") {
      // When running or paused, elapsed time equals the time since the last start plus any previous elapsed time.
      return Date.now() - this.startTime + this.elapsedBase;
    } else {
      // When stopped, it's just the accumulated elapsed time.
      return this.elapsedBase;
    }
  }

  // Formats a millisecond value as H:MM.ss
  formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Pad minutes and seconds with a leading zero if less than 10.
    const minutesStr = minutes < 10 ? "0" + minutes : "" + minutes;
    const secondsStr = seconds < 10 ? "0" + seconds : "" + seconds;

    if (hours > 0) {
      // For one or more hours, display H:MM.SS.
      return `${hours}:${minutesStr}.${secondsStr}`;
    } else {
      // For less than an hour, display MM.SS.
      return `${minutesStr}.${secondsStr}`;
    }
  }

  // -------------------------------
  // Core update method and interval
  // -------------------------------
  start() {
    if (!this.clockContainerElement) {
      throw new Error(
        "Clock element not provided. Please call TyrStopWatch.show() first."
      );
    }
    // If not already running, start the stopwatch.
    if (this.state !== "running") {
      // If starting fresh (or after a reset) we begin from 0.
      // (For a pause/resume, the elapsedBase has already been set.)
      this.startTime = Date.now();
      this.state = "running";
    }

    // The update function recalculates elapsed time and, if the stopwatch is in running state,
    // it updates the displayed text. (If in paused state, the internal elapsed time is computed
    // but the displayed value remains frozen.)
    const updateClock = () => {
      const elapsed = this.getElapsedTime();
      if (this.state === "running") {
        this.clockContainerElement.textContent =
          this.formatElapsedTime(elapsed);
      }
    };

    // Clear any previous interval to avoid having multiple timers.
    if (this.clockUpdateInterval) {
      clearInterval(this.clockUpdateInterval);
    }
    // Use an update interval of 500ms (0.5 seconds) rather than 50ms.
    this.clockUpdateInterval = setInterval(updateClock, 500);
    console.debug("Stopwatch started/resumed. State:", this.state);
  }

  // ------------------------------
  // Pause: "pauses" the clock indefinitely
  // ------------------------------
  pause() {
    if (this.state === "running") {
      // Capture the current elapsed time.
      this.elapsedBase = Date.now() - this.startTime + this.elapsedBase;
      // Switch to "paused" so the display is no longer updated.
      this.state = "paused";
      // Update the display one last time to show the paused time.
      this.clockContainerElement.textContent = this.formatElapsedTime(
        this.elapsedBase
      );
      console.debug(
        "Stopwatch paused at:",
        this.formatElapsedTime(this.elapsedBase)
      );
    }
  }

  // ------------------------------
  // Stop: completely stops the stopwatch (the interval is cleared).
  // ------------------------------
  stop() {
    if (this.state === "running" || this.state === "paused") {
      // If currently running, update elapsedBase one last time.
      if (this.state === "running") {
        this.elapsedBase = Date.now() - this.startTime + this.elapsedBase;
      }
      this.state = "stopped";
      // Clear the background update interval.
      if (this.clockUpdateInterval) {
        clearInterval(this.clockUpdateInterval);
        this.clockUpdateInterval = null;
      }
      // Update display so that it shows the final frozen time.
      this.clockContainerElement.textContent = this.formatElapsedTime(
        this.elapsedBase
      );
      console.debug(
        "Stopwatch stopped at:",
        this.formatElapsedTime(this.elapsedBase)
      );
    }
  }

  // ------------------------------
  // Resume: from either paused or stopped state.
  // For paused mode, the underlying time has been accumulating in elapsedBase already.
  // For stopped mode, resume continues from the stopped time.
  // ------------------------------
  resume() {
    if (this.state === "paused" || this.state === "stopped") {
      // Set a new start time so that getElapsedTime() continues from the existing elapsedBase.
      this.startTime = Date.now();
      this.state = "running";
      // If the interval is not active (as in the stopped state), start it.
      if (!this.clockUpdateInterval) {
        this.start();
      }
      console.debug("Stopwatch resumed. State:", this.state);
    }
  }

  // ------------------------------
  // Reset: sets the stopwatch back to zero.
  // ------------------------------
  reset() {
    if (this.clockUpdateInterval) {
      clearInterval(this.clockUpdateInterval);
      this.clockUpdateInterval = null;
    }
    this.elapsedBase = 0;
    this.startTime = null;
    this.state = "stopped";
    if (this.clockContainerElement) {
      this.clockContainerElement.textContent = this.formatElapsedTime(0);
    }
    console.debug("Stopwatch reset to 0:00.00");
  }

  // ------------------------------
  // Shows the stopwatch in a provided HTML element,
  // resets to 0:00.00, and then immediately starts running.
  // ------------------------------
  show(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided to Clock.show()");
    }
    this.clockContainerElement = element;
    this.reset(); // Set display to 0:00.00 and state to stopped.
    this.start();
    console.debug("Stopwatch show called, starting at 0:00.00");
  }

  // ------------------------------
  // Preset: sets the stopwatch to a specific starting value (in seconds)
  // and default auto-starts ticking from that time.
  // ------------------------------
  /*
  preset_OLD(timeInSeconds, autoStart = true) {
    // Clear any existing interval.
    if (this.clockUpdateInterval) {
      clearInterval(this.clockUpdateInterval);
      this.clockUpdateInterval = null;
    }
    // Set the elapsedBase to the provided preset time (in milliseconds)
    this.elapsedBase = timeInSeconds * 1000;
    // Initially, we keep the stopwatch stopped so that the display reflects the preset value.
    this.startTime = null;
    this.state = "stopped";
    if (this.clockContainerElement) {
      this.clockContainerElement.textContent = this.formatElapsedTime(
        this.elapsedBase
      );
    }
    console.debug(
      `Stopwatch preset to ${this.formatElapsedTime(this.elapsedBase)}`
    );
    // If autoSTart is true, resume the stopwatch immediately from the preset value.
    if (autoStart) {
      // the elapsedBase has already been preset
      this.startTime = Date.now(); // FIXME: Is this correct?
      this.state = "running";

      // The update function recalculates elapsed time and, if the stopwatch is in running state,
      // it updates the displayed text. (If in paused state, the internal elapsed time is computed
      // but the displayed value remains frozen.)
      const updateClock = () => {
        const elapsed = this.getElapsedTime();
        if (this.state === "running") {
          this.clockContainerElement.textContent =
            this.formatElapsedTime(elapsed);
        }
      };

      // Clear any previous interval to avoid having multiple timers.
      if (this.clockUpdateInterval) {
        clearInterval(this.clockUpdateInterval);
      }
      // Use an update interval of 500ms (0.5 seconds) rather than 50ms.
      this.clockUpdateInterval = setInterval(updateClock, 500);

      console.debug(
        "Stopwatch auto-started from preset value of: ",
        timeInSeconds
      );
    }
  }
  */

  /**
   * Preset: sets the stopwatch to a specific starting value (in seconds)
   * and auto-starts ticking from that time.
   */
  preset(timeInSeconds, autoStart = true) {
    // Clear any existing interval.
    if (this.clockUpdateInterval) {
      clearInterval(this.clockUpdateInterval);
      this.clockUpdateInterval = null;
    }

    // Set the elapsedBase to the provided preset time (converted to milliseconds)
    this.elapsedBase = timeInSeconds * 1000;
    // Ensure startTime is cleared so that getElapsedTime() returns only elapsedBase until started.
    this.startTime = null;
    // Set state to stopped so the clock remains static.
    this.state = "stopped";

    // Immediately display the preset time.
    if (this.clockContainerElement) {
      this.clockContainerElement.textContent = this.formatElapsedTime(
        this.elapsedBase
      );
    }
    console.debug(
      `Stopwatch preset to ${this.formatElapsedTime(this.elapsedBase)}`
    );

    // If autoStart is true, start the clock after a short delay.
    if (autoStart) {
      // Use a small delay (e.g. 200 ms) so that the preset value is visible briefly.
      setTimeout(() => {
        // Start ticking from the preset value.
        // Record the current time as the startTime for further elapsed calculations.
        this.startTime = Date.now();
        // Set state to "running" so the update logic takes effect.
        this.state = "running";

        const updateClock = () => {
          const elapsed = this.getElapsedTime(); // getElapsedTime() should calculate: (Date.now() - this.startTime) + this.elapsedBase
          if (this.state === "running" && this.clockContainerElement) {
            this.clockContainerElement.textContent =
              this.formatElapsedTime(elapsed);
          }
        };

        // Ensure no overlapping intervals.
        if (this.clockUpdateInterval) {
          clearInterval(this.clockUpdateInterval);
        }
        // Start updating the display every 500ms.
        this.clockUpdateInterval = setInterval(updateClock, 500);

        console.debug(
          "Stopwatch auto-started from preset value of:",
          timeInSeconds
        );
      }, 200); // delay in milliseconds—adjust as necessary (max 500ms acceptable)
    }
  }

  freeze(freezeTimeInSeconds) {
    // Only freeze if currently running
    if (this.state === "running") {
      // Pause the stopwatch (this updates elapsedBase and stops further display updates)
      this.pause();

      // Option 1: If you want the freeze period to be added so that when resumed,
      // the elapsed time immediately shows an extra freezeTimeInSeconds
      this.elapsedBase += freezeTimeInSeconds * 1000;

      // Then, after the freeze period, resume the stopwatch
      setTimeout(() => {
        // Optionally update the display immediately before resuming if needed:
        this.resume();
        console.debug(
          "Stopwatch resumed after freeze of",
          freezeTimeInSeconds,
          "seconds."
        );
      }, freezeTimeInSeconds * 1000);
    }
  }

  // Hide the stopwatch by setting its container's display to 'none'
  hide() {
    if (this.clockContainerElement) {
      this.clockContainerElement.style.display = "none";
      this.clockContainerElement.style.opacity = 0; //!important;
      this.clockContainerElement.classList.add("hiddenClock");
      console.debug("Stopwatch hidden");
    }
  }

  // Unhide (show) the stopwatch by resetting its container's display.
  unhide() {
    if (this.clockContainerElement) {
      this.clockContainerElement.style.display = "";
      this.clockContainerElement.style.opacity = 1; //!important;
      this.clockContainerElement.classList.remove("hiddenClock");
      // Optionally, force an immediate update.
      this.clockContainerElement.textContent = this.formatElapsedTime(
        this.getElapsedTime()
      );
      console.debug("Stopwatch unhidden");
    }
  }
}

// Attach the TyrStopWatch class as LW_TyrStopWatch to the global object.
if (typeof window !== "undefined") {
  window.LW_TyrStopWatch = TyrStopWatch;
  console.log(
    "Is this TyrStopWatch class only attached ONCE to the global object?"
  );
  //localStorage.setItem("hasTyrStopWatchBeenInstantiated", "true");
}

forceToggleThis() = function() {


}