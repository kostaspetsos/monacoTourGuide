console.log("Got into reservation API");

// Retrieve the form data
const userId = localStorage.getItem('userId');
var eventName = document.getElementById("title").textContent;
var ticketPrice = document.getElementById("priceTotal").textContent;
var selectedTickets = document.querySelectorAll('input[type="checkbox"]:checked');
var inputCard = document.getElementById('card1').value + document.getElementById('card2').value + document.getElementById('card3').value + document.getElementById('card4').value;
var payload = {
  userId: userId,
  eventName: eventName,
  ticketPrice: ticketPrice,
  email: document.getElementById("inputMail").value,
  cardNumber: inputCard
};

// Add ticket data to the payload
selectedTickets.forEach(function(ticket, index) {
  var personId = "person" + (index + 1);
  var firstName = document.getElementById(personId).querySelector('#firstName').value;
  var lastName = document.getElementById(personId).querySelector('#lastName').value;
  var seatId = document.getElementById(personId).querySelector('#ticket' + (index + 1)).textContent;
  
  payload["ticket" + (index + 1) + "_firstName"] = firstName;
  payload["ticket" + (index + 1) + "_lastName"] = lastName;
  payload["ticket" + (index + 1) + "_seatId"] = seatId;
});

// Send the POST request
fetch("http://localhost:3000/eventReservation", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
  .then(function(response) {
    if (response.ok) {
      
      window.location.href = "../frontend/reservation_done.html";
    } else {
      throw new Error("Reservation failed"); // Error handling for unsuccessful reservation
    }
  })
  .catch(function(error) {
    // Handle any errors
    console.error(error);
    // TODO: Handle error
  });
