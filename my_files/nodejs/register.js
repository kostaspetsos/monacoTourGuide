//Generate Random Username
var randomStringUsername = Math.random().toString(36).substring(2, 7);

// Get a reference to the register form
const registerForm = document.getElementById('register-form');
const successMessage = document.getElementById('success-alert');

// Add an event listener to the form submit button
registerForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the user's register credentials from the form
    const password = document.getElementById('password').value;

    //Empty
    const firstname = "";
    const lastname = "";
    const email = "";

    // Create an object with the user's registration credentials
    const registrationData = {
        firstname: firstname,
        lastname: lastname,
        username: randomStringUsername,
        password: password,
        email: email
    };

    // Create an AJAX request to the Node.js server using the fetch method
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
    });

    // Handle the server response based on the HTTP status code
    if (response.status === 201) {
        successMessage.textContent = `Registered! Your username is ${randomStringUsername}, please save it so you can Log In later.`;
        successMessage.style.display = 'block';

    } else {
        // Other server error, show an error message
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = 'An error occurred';
    }
});
