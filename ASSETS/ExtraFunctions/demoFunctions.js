// --------------------------------------------------------------
// SPX example custom functions for project/global extras.
// --------------------------------------------------------------
//
// These are just SOME THINGS custom controls can do. They can
// also send commands to external devices (light, sound, commands),
// execute commands on the operating system, access the web etc.
//
// See documentation for available user interface controls and
// their settings.
//
// If you need help in developing custom functionality to SPX-GC
// get in touch.
//
// (C) 2021- SPX Graphics
// MIT License.
//
// --------------------------------------------------------------

// ABANDONED using this demoFunctions file in config.json!!!
console.log("!!!! demoFunctions was loaded !!!!");

//let doFreezeTimerOnce = false; // MOVED HERE from spx_interface.js  ->  MUST be GLOBAL for whole UI!
// BUT IF TRYING TO INIT THE FLAG HERE I INSTEAD GET:
// ISSUE: Uncaught ReferenceError: doFreezeTimerOnce is not defined at runToggleTimerTaskPeriodically (spx_interface.js)
// WORKAROUND: Use persistent storage for this VERY GLOBAL FLAG!:
localStorage.setItem("doFreezeTimerOnce", "false");

/*
let globStopWatch = null;
let LW_TyrStopWatch;
*/
// Create an event bus (make sure this is globally accessible).
//var globOKTyrEventBus = new EventTarget();

// Function to dispatch an event on the OK Tyr event bus.
/*
function sendOKTyrEvent(data) {
  const event = new CustomEvent("customSignal", { detail: data });
  res = globOKTyrEventBus.dispatchEvent(event);
  console.log("dispatchEvent result: ", res);
}
*/

// Function to dispatch an event on a shared context, the global document:
/*
function sendOKTyrEvent(data) {
  const event = new CustomEvent("customSignal", {
    bubbles: true,
    detail: data,
  });
  const res = document.dispatchEvent(event);
  console.log("dispatchEvent result:", res); //true
}
*/

function hello(options) {
  // This is a demo function that can be used
  // with onPlay handler in the template definition
  // such as
  //
  // "function_onPlay": "hello|'World!'|500|f1"
  //
  // This function will be executed in 500ms (in this case) and it
  // receives paremeters as an array of strings. A basic example:
  //
  // [0] 'World!' ...... the argument passed to the function
  // [1] 'live icon' ... Current value of the "f1"-field (in this case)
  // [4] 123456678 ..... ItemID of the rundown item executing the call
  //
  // ######################################################################

  let msg = "\nhello() - in ASSETS/ExtraFunctions/demoFunctions.js\n";
  console.log(msg, options);
  msg += "Argument ...... " + options[0] + "\n";
  msg += "Field value ... " + options[1] + "\n";
  msg += "ItemID ........ " + options[2] + "\n";
  console.log(msg);
}

function APIConnector(mode = "") {
  let apiURL = "/api/v1/invokeTemplateFunction";
  let layer = 10;
  let fcall = "templateFunction";

  let url =
    apiURL + "?&webplayout=" + layer + "&function=" + fcall + "&params=" + mode;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} // APIConnector

// Handler function defined in SPX Project Extras - Function Library:
// 'demo_popup('Hello world!')'
function demo_popup(message) {
  // A basic hello world example
  alert(
    "A basic example of a custom function.\nThe text given as function argument was:\n\n" +
      message
  );
} // demo_popup

function demo_log(message) {
  // A basic hello world example
  console.log(
    "A basic example of a custom function.\nThe text given as function argument was:\n\n" +
      message
  );
} // demo_popup

function demo_toggle(eventButton) {
  // A basic toggle example
  let curValue = eventButton.getAttribute("data-spx-status");
  let colClass = eventButton.getAttribute("data-spx-color");
  if (curValue == "false") {
    eventButton.setAttribute("data-spx-status", "true");
    eventButton.innerText = eventButton.getAttribute("data-spx-stoptext");
    eventButton.classList.remove(colClass);
    eventButton.classList.add("bg_red");
    // add START logic here
    alert("A demo.\nModify the script to actually START something...");
  } else {
    eventButton.setAttribute("data-spx-status", "false");
    eventButton.innerText = eventButton.getAttribute("data-spx-playtext");
    eventButton.classList.remove("bg_red");
    eventButton.classList.add(colClass);
    // add STOP logic here
    alert("Demo continues.\nThe script could actually STOP something...");
  }
} // demo_toggle

/*
REQUIRED IN CONFIG:
"globalExtras": {
    "customscript": "/ExtraFunctions/demoFunctions.js",
    "CustomControls": [
      {
        "description": "Corner logo on/off",
        "ftype": "togglebutton",
        "bgclass": "bg_grey",
        "text0": "Logo ON",
        "text1": "Logo OFF",
        "fcall": "logoToggle(this)"
      }
    ]
  },
*/
function timerToggle(eventButton) {
  //alert("OK Tyr custom function toggle_time");
  console.log(
    "OK Tyr Project showExtras custom function timerToggle CALLED in demoFunctions.js.\n"
  );

  //  if (!doFreezeTimerOnce) {
  //    doFreezeTimerOnce = true; // Flag set for ToggleTimerTask in spx_interface!

  // WORKAROUND: Use persistent storage for setting this VERY GLOBAL FLAG!:
  localStorage.setItem("doFreezeTimerOnce", "true");
  //shouldRunToggleTimerTask = true; // Should not be needed (handled by PLAY command)
  //  }

  // A basic toggle example
  let curValue = eventButton.getAttribute("data-spx-status");
  let colClass = eventButton.getAttribute("data-spx-color");
  if (curValue == "false") {
    eventButton.setAttribute("data-spx-status", "true");
    eventButton.innerText = eventButton.getAttribute("data-spx-stoptext");
    eventButton.classList.remove(colClass);
    eventButton.classList.add("bg_red");
    // add START logic here
    //alert("A demo.\nModify the script to actually START something...");
  } else {
    eventButton.setAttribute("data-spx-status", "false");
    eventButton.innerText = eventButton.getAttribute("data-spx-playtext");
    eventButton.classList.remove("bg_red");
    eventButton.classList.add(colClass);
    // add STOP logic here
    //alert("Demo continues.\nThe script could actually STOP something...");
  }
} // timerToggle

// FIXME:
// Button event is caught here, but cannot propagate or send event or use any globals to notify my code about this click event.
// MOVED function toggle_time() to spx_interface.js
// ABANDONED using this demoFunctions file in config.json!!!
/*
function oktyr_toggleStopWatch() {
  alert("OK Tyr custom function oktyr_toggleStopWatch");
  console.log(
    "OK Tyr custom function oktyr_toggleStopWatch() CALLED in ExtraFunctionsdemoFunctions.js.\n"
  );

  // FIXME: DID NOT WORK
  // Dispatch a custom event to notify that a toggle has happened.
  document.dispatchEvent(new CustomEvent("stopWatchToggle"));

  if (globStopWatch) {
    console.debug("globStopWatch exists! Trying to freeze...");
    freezeStopWatchInstance(globStopWatch);
  } else {
    console.error("globStopWatch NOT FOUND HERE");
  }

  if (stopWatch) {
    console.debug("stopWatch exists! Trying to freeze...");
    freezeStopWatchInstance(stopWatch);
  } else {
    console.error("stopWatch NOT FOUND HERE");
  }

  if (window.LW_TyrStopWatch) {
    console.debug("window.LW_TyrStopWatch exists! Trying to freeze...");
    freezeStopWatchInstance(window.LW_TyrStopWatch);
    console.error("window.LW_TyrStopWatch NOT FOUND HERE");
  }
}
*/
function clearAllChannels() {
  // Will CLEAR all playout channels instantly, a "PANIC" button.
  console.log("Clearing gfx...");
  clearUsedChannels(); // <-- function in spx_gc.js
} // clearAllChannels

function wipeClean() {
  let data = {};
  data.relpath = "smartpx/Template_Pack_1/SPX1_COLORBUMPER.html"; // template file
  data.playserver = "OVERLAY"; // CCG server or '-'
  data.playchannel = "1"; // Channel
  data.playlayer = "20"; // Layer
  data.webplayout = "20"; // Web layer or '-'
  data.relpathCCG = data.relpath.split(".htm")[0];
  data.command = "play";
  ajaxpost("/gc/playout", data, "true");
  setTimeout(function () {
    stopAll();
  }, 50);
} // wipeClean

function playAll() {
  // Will send PLAY commands to all layers used by current rundown.
  // Timeout here allows some time for server to handle the incoming commands.
  // TODO: Far from elegant but kind of works. A better approach would be to
  // develop a server-side function for this.
  let ITEMS = document.querySelectorAll(".itemrow");
  ITEMS.forEach(function (templateItem, itemNro) {
    console.log("iterate row " + itemNro);
    setTimeout(function () {
      playItem(templateItem, "play");
    }, itemNro * 50); // 50, 100, 150, 200ms etc...
  });
} // playAll

function openWebpage(url = "https://spxgc.tawk.help/") {
  // Opens a new browser tab with url given.
  console.log("Hello ", url);
  window.open(url, "_blank");
  return false;
} // openWebpage

function openSelectedURL(selectList) {
  // Gets an item from a "selectbutton" dropdown and navigates to a URL
  let URL = document.getElementById(selectList).value;
  openWebpage(URL);
} // openSelectedURL

function playAudiofile(file) {
  playServerAudio(file, (message = "playAudiofile " + file));
} // playAudiofile

function playSelectedAudio(selectList) {
  // Reads a path of audio file (in ASSETS folder) from current value of the select list
  // and triggers a function which will pass the filename to SPX-GC which will play the
  // sound on the server.
  sfx = document.getElementById(selectList).value;
  playServerAudio(sfx, (message = "Custom audio button"));
} // playSelectedAudio
