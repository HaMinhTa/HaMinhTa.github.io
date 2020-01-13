let image = new Image();
image.src = "image/meaningful.jpg";
image.onload = function() {
    draw(this);
}

function draw(image) {
    let canvas = document.getElementById("mypic");
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    let imageData = ctx
}