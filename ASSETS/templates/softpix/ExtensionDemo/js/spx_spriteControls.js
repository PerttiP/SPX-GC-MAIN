// Additional helper functions for jsmovieclip-1.js.

function createSprite(spWidth, spHeight, spCols, spRows, spFPS, pauseFrame, DomElement){
    // Usage:
    // createSprite('LogoAnim', 200, 60, 5, 10, 25, 15, '#LogoDiv')
    var Options = {};
    Options.framerate = spFPS;
    Options.frames = [];
    for (let ROWS = 0; ROWS < spRows; ROWS++) {
        for (let COLS = 0; COLS < spCols; COLS++) {
            frame = {}
            frame.x = COLS * spWidth;
            frame.y = ROWS * spHeight;
            Options.frames.push(frame);
        }}
    var sprite = new JSMovieclip(document.querySelector(DomElement), Options); 
    sprite.spxPauseFrame = pauseFrame;
    return sprite 
}


function playSpriteIn(spriteObj) {
    pauseFrame = spriteObj.spxPauseFrame;
    spriteObj.gotoAndStop(0);
    spriteObj.loopBetween(0, pauseFrame).play(false);
    // console.log('Playing IN ' + spriteObj.elmts[0].id + ' from 0 to ' + pauseFrame);
}

function playSpriteOut(spriteObj) {
    pauseFrame = spriteObj.spxPauseFrame;
    lastFrame = spriteObj.frames.length;
    spriteObj.gotoAndStop(pauseFrame);
    spriteObj.loopBetween(pauseFrame, lastFrame).play(false);
    // console.log('Playing OUT ' + spriteObj.elmts[0].id + ' from ' + pauseFrame + ' to ' + lastFrame);
}

function showFrame(spriteObj, Frame) {
    spriteObj.stop();
    spriteObj.gotoAndStop(Frame);
    // console.log('Showing frame ' + Frame + ' in ' + spriteObj.elmts[0].id);
}

function playSprite(spriteObj, StartFrame, EndFrame, loopBool) {
    if (spriteObj.playing) {return}
    spriteObj.gotoAndStop(StartFrame);
    spriteObj.loopBetween(StartFrame, EndFrame).play(loopBool);
}
