function loadInfo() {
    // Get the user ID from localStorage
    const userId = localStorage.getItem('userId');

    // Send a GET request to the server with the user ID as a query parameter
    fetch(`http://localhost:3000/user?id=${userId}`)
        .then((response) => response.json())
        .then((user) => {
            //An de n einai null tha mpei
            if (user.firstname) {
                document.getElementById('firstname').value = user.firstname;
            }
            if (user.lastname) {
                document.getElementById('lastname').value = user.lastname;
            }

            document.getElementById('username').value = user.username;
            document.getElementById('password').value = user.password;

            if (user.email) {
                document.getElementById('email').value = user.email;
            }
        })
        .catch((error) => console.error(error));
}

async function saveInfo() {
    console.log("Got into saveInfo");

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    const _id = localStorage.getItem("userId");
    console.log(_id);


    // Create an object with the user's information
    const Data = {
        _id: _id,
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        email: email
    };
    console.log(Data);

    // Create an AJAX request to the Node.js server using the fetch method
    const response = await fetch('http://localhost:3000/addUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
    });

    console.log(response.status);
    // Handle the server response based on the HTTP status code
    if (response.status === 200) {

        // Redirect to the home page
        window.location.href = 'home.html';

    } else if (response.status === 401) {


    } else {
        // Other server error, show an error message
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = 'An error occurred';
    }
}  
