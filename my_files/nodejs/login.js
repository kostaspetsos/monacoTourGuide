// Get a reference to the login form
const loginForm = document.getElementById('login-form');

const successMessage = document.getElementById('success-alert');
const failureMessage = document.getElementById("failure-alert");


// Add an event listener to the form submit button
loginForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the user's login credentials from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create an object with the user's login credentials
    const loginData = {
        username,
        password
    };

    // Create an AJAX request to the Node.js server using the fetch method
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });

    // Handle the server response based on the HTTP status code
    if (response.status === 200) {
        // Login successful, set loggedIn to true in localStorage
        localStorage.setItem('loggedIn', true);

        // Get the user ID from the response
        const userId = await response.json();

        // Set the user _id in localStorage
        localStorage.setItem('userId', userId.id);
        document.cookie = `userId=${userId.id}; path=/`;

        // Redirect to the home page
        window.location.href = 'home.html';

        loginForm.style.display = "initial";

    } else if (response.status === 401) {
        // Invalid username or password, show an error message
        failureMessage.textContent = `Invalid username or password`;
        failureMessage.style.display = 'block';

        errorMessage.innerText = "Invalid username or password.";

    } else {
        // Other server error, show an error message
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = 'An error occurred';
    }
});
