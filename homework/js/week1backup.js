let button = document.getElementById("modifypage");
button.addEventListener("click", function() {
    document.body.style.backgroundColor = "yellow";
    document.getElementById("title").style.color = "rgb(0,191,255)";
    document.getElementById("modifypage").style.backgroundColor = "rgb(0,191,255)";
    document.getElementById("image").src = "image/meaningful2.jpg";
})