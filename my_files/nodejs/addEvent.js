function addEvent() {
    // Get the form input values
    const date = document.getElementById('date').value;
    const photo1 = document.getElementById('photo1').value;
    const photo2 = document.getElementById('photo2').value;
    const title = document.getElementById('title').value;
    const info = document.getElementById('info').value;

    const eventData = {
        date,
        photo1,
        photo2,
        title,
        info
    };

    // Send a POST request to the endpoint
    fetch('http://localhost:3000/addEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request failed');
            }
        })
        .then(data => {
            // Reset the form fields
            document.getElementById('date').value = '';
            document.getElementById('photo1').value = '';
            document.getElementById('photo2').value = '';
            document.getElementById('title').value = '';
            document.getElementById('info').value = '';

            // Show the success message
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';

            // Hide the success message after 4 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';

                // Refresh the page
                location.reload();
            }, 1500);
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.error(error);
        });
}
