// tyrclock.js - a non-module version for client-side use
// Based on code by Mohammad-karimi
// from https://github.com/karimi-mohammad/lightweight-clock/blob/main/index.js

// This JavaScript library provides a simple and intuitive way to display a live, updating clock in your web applications.
// It offers a clean and efficient implementation, making it ideal for scenarios where performance and resource usage are essential.

/*
License:
    MIT License

    Copyright (c) 2024 Mohammad-karimi

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

// Wrap the code in a class declaration
class TyrClock {
  /**
   * Constructor of the class.
   * Initializes properties for the container element and interval.
   */
  constructor() {
    /**
     * HTML element that displays the clock.
     * @type {HTMLElement|null}
     */
    this.clockContainerElement = null;

    /**
     * setInterval id for continuous time update.
     * @type {number|null}
     */
    this.clockUpdateInterval = null;
  }

  /**
   * Returns the current time as an object.
   * @returns {Object} NowTime object with hours, minutes, and seconds.
   */
  getNow() {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  }

  /**
   * Starts continuous time update and display.
   */
  start() {
    if (!this.clockContainerElement) {
      throw new Error(
        "Clock element not provided. Please call TyrClock.show() first."
      );
    }

    const updateClock = () => {
      try {
        const now = this.getNow();
        // You can customize the format here as needed.
        this.clockContainerElement.textContent = `${now.hours}:${now.minutes}:${now.seconds}`;
      } catch (error) {
        console.error("Error updating clock:", error);
      }
    };

    // Update immediately before starting the interval if desired.
    updateClock();

    this.clockUpdateInterval = setInterval(updateClock, 1000);
  }

  /**
   * Stops the time update.
   */
  stop() {
    clearInterval(this.clockUpdateInterval);
    this.clockUpdateInterval = null; // Reset the interval id.
  }

  /**
   * Shows the clock in a provided HTML element.
   * @param {HTMLElement} element - The element to display the clock in.
   */
  show(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided to Clock.show()");
    }

    this.clockContainerElement = element;
    this.start();
  }
}

// Attach the TyrClock class to the global object as LW_TyrClock
if (typeof window !== "undefined") {
  window.LW_TyrClock = TyrClock;
}
