function makeReservation() {
    var mail = document.getElementById('inputMail').value;
    var card = document.getElementById('card1').value + document.getElementById('card2').value + document.getElementById('card3').value + document.getElementById('card4').value;
    var rndmInput = document.getElementById('inputRndm').value;
    var rndmGenerated = document.getElementById('securityCode').innerHTML;

    console.log('Card lenght is: ' + card.length);
    console.log(rndmInput);
    console.log(rndmGenerated);
    if (card.length === 16 && rndmInput === rndmGenerated && mail != 0) {
        console.log('Everything seems fine, time to move on...');
        //This function fetches the /mail endpoint that sends the tickets to the user's mail.
        var eventName = document.getElementById('title').innerText;
        var ticketsText = emailText();

        console.log('Event name: ' + eventName);
        console.log('The mail is: ' + mail);
        console.log('The ticket text is: ' + ticketsText);


        sendReservationMail(eventName, mail, ticketsText);

        //If everything is OK its time to call the API to insert everything into the DB
        const script = document.createElement('script');
        script.src = '../nodejs/reservation.js';
        document.body.appendChild(script);
    } else {
        console.log("Something's wrong i can feel it...");
        alert("Something's wrong i can feel it...");
    }


}

// Function to send the reservation mail
function sendReservationMail(nameEvent, mail, ticketsText) {
    const eventName = nameEvent;
    const email = mail;
    const additionalText = ticketsText;

    // Create the request body
    const requestBody = JSON.stringify({
        eventName: eventName,
        email: email,
        additionalText: additionalText
    });

    // Send the POST request to the email endpoint
    fetch('http://localhost:3000/email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    })
        .then(response => {
            if (response.ok) {
                // Reservation successful
                console.log('Reservation successful. Email sent.');
            } else {
                // Error occurred while sending email
                console.log('Error occurred while sending email.');
            }
        })
        .catch(error => {
            console.log('Error sending reservation request:', error);
        });
}

function emailText() {
    var selectedTickets = document.querySelectorAll('input[type="checkbox"]:checked');
    var ticketsText = "Your tickets: " + "\n";

    selectedTickets.forEach(function (ticket, index) {
        var personId = "person" + (index + 1);
        var firstName = document.getElementById(personId).querySelector('#firstName').value;
        var lastName = document.getElementById(personId).querySelector('#lastName').value;
        var seatId = document.getElementById(personId).querySelector('#ticket' + (index + 1)).textContent;

        ticketsText += "Name: " + firstName + " " + lastName + ", Seat: " + seatId + "\n";
    });

    return ticketsText;
}