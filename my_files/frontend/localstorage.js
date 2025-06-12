function localStorageSet(titleText, imageSrc) {
    console.log("Got in localStorageSet");
    var title = titleText;
    var photo = imageSrc;

    localStorage.setItem("title", title);
    localStorage.setItem("picture", photo);
    console.log(title);
    console.log(photo);


    const failureMessage = document.getElementById("failure-alert");
    var flag = localStorage.getItem("loggedIn");
    if (flag === "true") {
        location.href = "reservation.html";
    } else {
        failureMessage.textContent = `You must be logged in to make a Reservation`;
        failureMessage.style.display = 'block';
    }
    
    
}

function localStorageGet() {
    console.log("Got in localStorageGet");
    var title = localStorage.getItem("title");
    var photo = localStorage.getItem("picture");
    console.log(photo);

    document.getElementById("title").innerHTML = title;
    document.getElementById("photo").setAttribute("src", photo);
}