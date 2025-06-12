//FOR HOME PAGE ONLY
function loggedInCheck() {
    //Flag is true if the user is indeed logged in
    var flag = localStorage.getItem("loggedIn");

    const logOutBtn = document.getElementById('logOut');
    const accountBtn = document.getElementById('accSettings');
    const registerBtn = document.getElementById('registerBtn');

    //IF USER IS CONNECTED
    if (flag === "true") {
        //MAKE EVERYTHING ELSE VISIBLE
        logOutBtn.style.display = "initial";
        accountBtn.style.display = "initial";
        registerBtn.style.display = "none";

        //MAKE LOG IN FORM HIDDEN
        var loginForm = document.getElementById("login-form");
        loginForm.style.display = "none";  
    }
}

//FOR ALL THE OTHER PAGES
function loggedInCheck2() {
    //Flag is true if the user is indeed logged in
    var flag = localStorage.getItem("loggedIn");

    const homeNavItem = document.getElementById('logOut');


    if (flag === "true") {
        homeNavItem.style.display = "initial";       
    }
}


function logOut() {
    localStorage.removeItem('loggedIn');

    // Redirect to the home page
    window.location.href = 'home.html';
}

function redirectToRegister() {
    window.location.href = 'register.html';
}