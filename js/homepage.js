    ///////////////////////////////////////////////////////////////////////////
    // Set up greeting ////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var today = new Date();
    var hour = today.getHours();

    var greeting;
    var image;
    if (hour < 12){
      greeting = "Good morning";
      image = "images/morning.png";
    } else if (hour < 18){
      greeting = "Good afternoon";
      image = "images/afternoon.png";
    } else {
      greeting = "Good evening";
      image = "images/night2.png";
    }

    document.querySelector("#greeting-image").src = image;

    var amPm;
    if (hour >= 12){
      amPm = "PM";
    } else {
      amPm = "AM";
    }
    var hour12 = (hour <= 12) ? hour : hour % 12;
    var minutes = today.getMinutes();
    if(minutes <10) {
      var minutes60 ="0" + minutes;
    } else {
      var minutes60 = minutes;
    }
    var time = hour12 + ":" + minutes60 + " " + amPm;

    var i = 0;
    var txt = `${greeting} from Ha Ta! The time is currently ${time}. I hope you enjoy my stories!`; /* The text */
    var speed = 40; /* The speed/duration of the effect in milliseconds */

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("greetings").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter()

