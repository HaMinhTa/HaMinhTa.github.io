let image = new Image();
image.src = "image/meaningful.jpg";
image.onload = function() {
    draw(this);
}

function draw(image) {
    let canvas = document.getElementById("mypic");
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, 700, 525);
    let data = imageData.data;

    let grayscale = function() {
        for (let i = 0; i < data.length; i+=4) {
            let avg = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = avg;
            data[i+1] = avg;
            data[i+2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    document.getElementById("monochromeBtn").addEventListener("click", grayscale);
}