const createWatermark = () => {

    /*
        Usage:
        <script src="js/spx_watermark.js" type="module" data-pos="ne"></script>

        INFO - This is work in progress.
        Need to implement a way to set the position of the watermark.

    */



    let args = document.querySelector('script[src*="spx_watermark.js"]').dataset;
    // console.log('args.pos', args.pos);
    let body = document.querySelector('body');
    let watermark = document.createElement('div');
    watermark.id = 'watermark';
    watermark.innerHTML = 'SPX.GRAPHICS';
    body.appendChild(watermark);
    let style = document.createElement('style');
    style.innerHTML = `
        #watermark {
            top: 0;
            left: 0;
            opacity: 0;
            color: black;
            z-index: 9999;
            font-size: 3vh;
            line-height: 1;
            text-align: left;
            position: absolute;
            height: fit-content;
            mix-blend-mode: screen;
            font-family: sans-serif;
            padding: 0.5em 6em 0.5em 4em;
            transform-origin: bottom left;
            background: rgba(200, 255, 200, 0.6);
            transform: rotate(-25deg) translate(-20%, 190%);

            transition-duration: 2s;
            transition-property: opacity;
            transition-timing-function: linear;
        }`;
        
    body.appendChild(style);
    setTimeout(() => {
        watermark.style.opacity = 1;
    },2000);

    setTimeout(() => {
        watermark.style.opacity = 0;
    },10000);
}

createWatermark();