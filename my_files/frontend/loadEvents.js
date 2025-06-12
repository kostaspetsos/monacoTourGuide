function loadEvents(formId) {
  fetch('http://localhost:3000/getEvents')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch events');
      }
    })
    .then(events => {
      const eventSelect = document.getElementById('event');

      // Clear previous options
      eventSelect.innerHTML = '';

      // Add "Select here" as the default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select here';
      eventSelect.appendChild(defaultOption);

      // Add each event as an option in the select
      events.forEach(event => {
        const option = document.createElement('option');
        option.value = event._id;
        option.textContent = event.title;
        eventSelect.appendChild(option);
      });

      // Add event listener to handle event selection
      eventSelect.addEventListener('change', () => handleEventSelection(formId));
    })
    .catch(error => {
      console.error(error);
    });
}

// Function to handle event selection and populate the form fields
function handleEventSelection(formId) {
  const eventSelect = document.getElementById('event');
  const selectedEventId = eventSelect.value;

  if (selectedEventId) {
    fetch(`http://localhost:3000/getEventById/${selectedEventId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch event details');
        }
      })
      .then(event => {
        // Log the event details
        console.log('Event details:', event);

        // Populate the form fields with the event details
        const form = document.getElementById(formId);
        if (form) {
          form.elements.date.value = event.date;
          form.elements.photo1.value = event.photo1;
          form.elements.photo2.value = event.photo2;
          form.elements.title.value = event.title;
          form.elements.info.value = event.info;
        }
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    // Clear the form fields if no event is selected
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
    }
  }
}

// Call the loadEvents function with the form ID
//loadEvents('modifyEventForm');
