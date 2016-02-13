function loadImage() {
    var input, file, fr, img, rotation = 0, 
        rotateImage,
        flip;
    var WIDTH = 1024,
        HEIGHT = 600,
        RATIO = WIDTH / HEIGHT;

    if (typeof window.FileReader !== 'function') {
        write("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('imgfile');
    if (!input) {
        write("Um, couldn't find the imgfile element.");
    }
    else if (!input.files) {
        write("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        write("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = createImage;
        fr.readAsDataURL(file);
    }

    function createImage() {
        img = new Image();
        img.onload = drawIt;
        img.src = fr.result;
    }

    function rotate(ctx, angle) {
        ctx.rotate((angle + flip) * Math.PI / 180);
    }

    function drawIt() {
        rotateImage = document.getElementById('rotate').checked;
        flip = document.getElementById('flip').checked ? 180 : 0;
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var w = img.width;
        var h = img.height;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.save();
        ctx.translate(WIDTH / 2, HEIGHT / 2);


        if (!rotateImage) {
            rotate(ctx, 0);
            drawBlur(ctx, WIDTH, HEIGHT, w, h);
        } else {
            rotate(ctx, 90);
            drawImage(ctx, HEIGHT, WIDTH, w, h);
        }
        
        stackBlurCanvasRGB("canvas", 0, 0, WIDTH, HEIGHT, 75);
        if (!rotateImage) {
            drawImage(ctx, WIDTH, HEIGHT, w, h);
        } else {
            drawBlur(ctx, HEIGHT, WIDTH, w, h);   
        }
        ctx.restore();
    }

    function drawBlur(ctx, sw, sh, iw, ih) {
        var imgRatio = ih / iw;
        var newHeight = sw * imgRatio;
        ctx.drawImage(img, -sw / 2, -newHeight/2, sw, newHeight);
    }

    function drawImage(ctx, sw, sh, iw, ih) {
        var imgRatio = iw / ih;
        var newWidth = sh * imgRatio;
        ctx.drawImage(img, -newWidth / 2, -sh / 2, newWidth, sh);
    }

    function write(msg) {
        console.log(msg);
    }

    window.drawIt = drawIt;
}