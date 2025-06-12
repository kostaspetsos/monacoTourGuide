document.addEventListener('DOMContentLoaded', function () {
    // Retrieve userId from local storage
    const userId = localStorage.getItem('userId');

    if (!userId) {
        // Handle the case when userId is not available
        console.error('User ID not found in local storage.');
        return;
    }

    // Fetch the reservation data from the server
    const url = `http://localhost:3000/getOldReservations?userId=${userId}`;
    fetch(url)
    .then(response => response.json())
    .then(reservations => {
        const reservationsContainer = document.getElementById('reservations-container');

        // Check if reservations exist
        if (reservations.length === 0) {
            reservationsContainer.innerHTML = '<p>No reservations found.</p>';
            return;
        }

        // Iterate over reservations and create HTML for each
        reservations.forEach(reservation => {
            const reservationContainer = document.createElement('div');
            reservationContainer.classList.add('reservation-container');

            const eventName = document.createElement('h4');
            eventName.textContent = reservation.eventName;

            const ticketPrice = document.createElement('p');
            ticketPrice.textContent = 'Total Price: ' + reservation.ticketPrice;

            const ticketsList = document.createElement('ul');
            reservation.tickets.forEach(ticket => {
                const listItem = document.createElement('li');
                listItem.textContent = 'Ticket: ' + ticket.firstName + ' ' + ticket.lastName + ', Seat: ' + ticket.seatId;
                ticketsList.appendChild(listItem);
            });

            const email = document.createElement('p');
            email.textContent = 'Email: ' + reservation.email;

            const resendButton = document.createElement('button');
            resendButton.textContent = 'Resend Tickets to Email';
            resendButton.classList.add('btn', 'btn-primary');
            resendButton.addEventListener('click', function () {
                resendTickets(reservation);
            });

            reservationContainer.appendChild(eventName);
            reservationContainer.appendChild(ticketPrice);
            reservationContainer.appendChild(ticketsList);
            reservationContainer.appendChild(email);
            reservationContainer.appendChild(resendButton);

            reservationsContainer.appendChild(reservationContainer);
        });
    })
    .catch(error => console.log('Error fetching reservations:', error));

    function resendTickets(reservation) {
        const ticketsText = reservation.tickets.map(ticket => `Ticket: ${ticket.firstName} ${ticket.lastName}, Seat: ${ticket.seatId}`).join('\n');
  
        const eventData = {
            eventName: reservation.eventName,
            email: reservation.email,
            additionalText: `Tickets:\n${ticketsText}\n\nIt works!`
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        };

        fetch('http://localhost:3000/email', requestOptions)
            .then(response => {
                if (response.ok) {
                    console.log('Email sent successfully!');
                } else {
                    console.error('Failed to send email.');
                }
            })
            .catch(error => console.error('Error sending email:', error));
    }
});
