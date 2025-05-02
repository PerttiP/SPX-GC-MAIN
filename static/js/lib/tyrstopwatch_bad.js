// tyrStopWatch.js – expanded stopwatch functionality (non‑module version)
//  - with seconds precision and formatted as H:MM.ss
// Based partly on code by Mohammad-karimi with modifications for stopwatch behavior
// from https://github.com/karimi-mohammad/lightweight-clock/blob/main/index.js

class TyrStopWatch {
  constructor() {
    // The HTML element where the time will be displayed.
    this.clockContainerElement = null;
    // Holds the ID returned by setInterval.
    this.clockUpdateInterval = null;
    // The timestamp (in ms) when the stopwatch was last started or resumed.
    this.startTime = null;
    // The timestamp (in ms) that the stopwatch was preset to.
    this.presetTime = null;
    // The accumulated elapsed time (in ms) from earlier sessions.
    this.elapsedBase = 0;
    /*
          The state of the stopwatch:
            "running" – It’s actively updating the display.
            "paused"  – The display is frozen although the internal elapsed time is still increasing.
            "stopped" – The stopwatch is halted (the interval is cleared); elapsed time is fixed.
        */
    // The timestamp when pause was triggered last
    this.pausedAtTime = 0;
    this.state = "stopped";
  }

  // Returns the current elapsed time (in milliseconds).
  getElapsedTime() {
    if (this.state === "running" || this.state === "paused") {
      // When running or paused, elapsed time equals the time since the last start plus any previous elapsed time.
      //  the internal time is: (current time - startTime) + elapsedBase
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
      if (this.state === "preset") {
        // If a preset time is set, then start from that timestamp
        this.startTime = this.presetTime;
      } else {
        // If starting fresh (or after a reset) we begin from 0.
        // (For a pause/resume, the elapsedBase has already been set.)
        this.startTime = Date.now();
      }
      this.state = "running";
    }

    // The update function recalculates elapsed time and, if the stopwatch is in running state,
    // it updates the displayed text. (If in paused state, the internal elapsed time is computed
    // but the displayed value remains frozen.)
    const updateClock = () => {
      if (this.state === "running") {
        const elapsed = this.getElapsedTime();
        this.clockContainerElement.textContent =
          this.formatElapsedTime(elapsed);
      }
      // (When paused, we intentionally do nothing so that the displayed time remains frozen.)
    };

    // Clear any previous interval to avoid having multiple timers.
    if (this.clockUpdateInterval) {
      clearInterval(this.clockUpdateInterval);
    }
    // Use an update interval of 500ms (0.5 seconds) rather than 50ms.
    this.clockUpdateInterval = setInterval(updateClock, 500);

    // TODO?:
    // Immediately update the display.
    updateClock();

    console.debug("Stopwatch started/resumed. State:", this.state);
  }

  // ------------------------------
  // Pause: freezes the display, but underlying time continues.
  // ------------------------------
  pause() {
    if (this.state === "running") {
      // Capture the current elapsed time.
      this.elapsedBase = Date.now() - this.startTime + this.elapsedBase;
      this.pausedAtTime = this.elapsedBase;
      // Switch to "paused" so the display is no longer updated.
      this.state = "paused";
      // Update the display one last time to show the frozen time.
      this.clockContainerElement.textContent = this.formatElapsedTime(
        this.pausedAtTime
      );
      console.debug(
        "Stopwatch paused at:",
        this.formatElapsedTime(this.pausedAtTime)
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
    if (this.state === "paused") {
      this.startTime = this.pausedAtTime;
      this.state = "running";
      if (!this.clockUpdateInterval) {
        console.warn(
          "STRANGE BEHAVIOR: the clock update interval was not active when in paused state"
        );
        this.start();
      }
      // TODO?: Immediately update the display.
      this.clockContainerElement.textContent = this.formatElapsedTime(
        this.getElapsedTime()
      );
      console.debug("Stopwatch resumed from paused state. State:", this.state);
    } else if (this.state === "stopped") {
      // Set a new start time so that getElapsedTime() continues from the existing elapsedBase.
      this.startTime = Date.now();
      this.state = "running";
      // If the interval is not active (as in the stopped state), start it.
      if (!this.clockUpdateInterval) {
        this.start();
      }
      console.debug("Stopwatch resumed from stopped state. State:", this.state);
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

  presetToSeconds(timeInSeconds) {
    let ms = timeInSeconds * 1000;

    if (this.clockUpdateInterval) {
      clearInterval(this.clockUpdateInterval);
      this.clockUpdateInterval = null;
    }
    this.elapsedBase = ms;
    //this.startTime = null;
    this.state = "preset";
    if (this.clockContainerElement) {
      this.clockContainerElement.textContent = this.formatElapsedTime(ms);
    }
    console.debug("Stopwatch reset to: ", this.formatElapsedTime(ms));
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
}
