document.addEventListener('DOMContentLoaded', function () {
  // Add event listener to delete event button
  const deleteEventButton = document.getElementById('deleteEventButton');
  deleteEventButton.addEventListener('click', deleteEvent);

  function deleteEvent() {
    console.log('Got into deleteEvent');
    const eventId = document.getElementById('event').value;

    if (eventId) {
      fetch(`http://localhost:3000/deleteEvent/${eventId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log('Event deleted successfully');

            // Show success message
            const successMessage = document.getElementById('success-delete-message');
            successMessage.style.display = 'block';

            // Refresh the page after a delay
            setTimeout(function () {
              location.reload();
            }, 1500); // Refresh after 3 seconds
          } else if (response.status === 404) {
            console.log('Event not found');
            // Display failure message
            showNotification('Event not found', 'danger');
          } else {
            throw new Error('Failed to delete event');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.log('No event selected');
      // Display failure message
      showNotification('Please select an event', 'danger');
    }
  }

  // Show success message after page refresh
  const successMessage = document.getElementById('success-delete-message');
  if (successMessage.style.display !== 'none') {
    setTimeout(function () {
      successMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds
  }
});
