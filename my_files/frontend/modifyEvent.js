// Function to modify the event
function modifyEvent(eventId) {
    // Get the form elements
    const form = document.getElementById('modifyEventForm');
    const title = form.elements.title.value;
    const date = form.elements.date.value;
    const photo1 = form.elements.photo1.value;
    const photo2 = form.elements.photo2.value;
    const info = form.elements.info.value;
    const disableEvent = form.elements.disableEvent.checked; // Get the checkbox value

    // Create the request body
    const requestBody = {
        title: title,
        date: date,
        photo1: photo1,
        photo2: photo2,
        info: info,
        disableEvent: disableEvent // Include the checkbox value in the request body
    };

    const successMessage = document.getElementById('success-update-message');

    // Fetch the endpoint to modify the event
    fetch(`http://localhost:3000/modifyEvent/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (response.ok) {
                console.log('Event modified successfully');
                // Handle any additional actions after modifying the event

                successMessage.style.display = 'block'; // Show the success message

                setTimeout(function () {
                    successMessage.style.display = 'none'; // Hide the success message after 3 seconds
                }, 3000);
            } else {
                throw new Error('Failed to modify event');
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Call the loadEvents function with the form ID
loadEvents('modifyEventForm');

// Capture the form submission event
const modifyEventForm = document.getElementById('modifyEventForm');
modifyEventForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevent the default form submission behavior
    const eventSelect = document.getElementById('event');
    const selectedEventId = eventSelect.value;

    if (selectedEventId) {
        modifyEvent(selectedEventId);
    } else {
        console.log('No event selected');
    }
});
