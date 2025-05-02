//function getSelectedDataFromTemplate() {
window.getSelectedDataFromTemplate = function () {
  // Dummy function
  // Will be redefined in body section by HTML that uses it!

  console.log(
    "Dummy function getSelectedDataFromTemplate called in buttonClickEventHandler.js!"
  );
};

window.updateFollowedRunner = function () {
  //alert("updateFollowedRunner() CALLED!");
  console.log(
    "Button click event handler window.updateFollowedRunner called in buttonClickEventHandler.js!"
  );

  getSelectedDataFromTemplate();
};

let myStopWatch = null;

function pauseMyStopWatch() {
  if (myStopWatch) myStopWatch.pause();
}

function resumeMyStopWatch() {
  if (myStopWatch) myStopWatch.resume();
}

function startMyStopWatch() {
  if (myStopWatch) myStopWatch.start();
}

function stopMyStopWatch() {
  if (myStopWatch) myStopWatch.stop();
}

function resetMyStopWatch() {
  if (myStopWatch) myStopWatch.reset();
}

function presetMyStopWatch(timeInSeconds) {
  if (myStopWatch) myStopWatch.preset(timeInSeconds);
}
