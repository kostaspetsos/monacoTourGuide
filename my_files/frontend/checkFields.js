function checkFields() {

    var persons = document.getElementById("numOfPersons").value;
    var seatsBox = document.getElementById("seatsBox");
    var classA = document.getElementsByClassName("A");
    var classB = document.getElementsByClassName("B");
    var classC = document.getElementsByClassName("C");
    var priceTotal = document.getElementById("priceTotal");
    var confirmBtn = document.getElementById('seatsConfirmBtn');
    var priceSeat_A = 30;
    var priceSeat_B = 22;
    var priceSeat_C = 17;
    var eventName = document.getElementById('title');
    const encodedEventName = encodeURIComponent(eventName.innerText);
    console.log('Title isssss:' + encodedEventName)

    seatsBox.style.visibility = 'hidden';

    if (persons != "Select here") {
        console.log("Selected No of Persons: " + persons);

        //Epilogh A klashs Eisithriou
        if (document.getElementById('tA').checked) {
            console.log("Selected A");
            seatsBox.style.visibility = 'visible';
            confirmBtn.style.visibility = 'hidden';
            priceTotal.innerHTML = priceSeat_A * persons + ("&euro;")

            for (var x = 0; x < classA.length; x++) {
                //Kanw uncheck ola osa de xreiazontai
                classB[x].checked = false;
                classC[x].checked = false;

                //Kanw disable ola osa de xreiazontai
                classA[x].disabled = false;
                classB[x].disabled = true;
                classC[x].disabled = true;
            }

            //Returns the IDs of all the taken seats and calls a function that disables these seats in the html
            fetch(`http://localhost:3000/eventReservations/${encodedEventName}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Request failed');
                    }
                    return response.json();
                })
                .then((seatIds) => {
                    disableCheckboxes(seatIds);
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                });


            //Epilogh B klashs Eisithriou
        } else if (document.getElementById('tB').checked) {
            console.log("Selected B");
            seatsBox.style.visibility = 'visible';
            confirmBtn.style.visibility = 'hidden';
            priceTotal.innerHTML = priceSeat_B * persons + ("&euro;")

            for (var x = 0; x < classA.length; x++) {
                classA[x].checked = false;
                classC[x].checked = false;

                classA[x].disabled = true;
                classB[x].disabled = false;
                classC[x].disabled = true;
            }

            //Returns the IDs of all the taken seats and calls a function that disables these seats in the html
            fetch(`http://localhost:3000/eventReservations/${encodedEventName}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Request failed');
                    }
                    return response.json();
                })
                .then((seatIds) => {
                    disableCheckboxes(seatIds);
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                });

            //Epilogh C klashs Eisithriou
        } else if (document.getElementById('tC').checked) {
            console.log("Selected C");
            seatsBox.style.visibility = 'visible';
            confirmBtn.style.visibility = 'hidden';
            priceTotal.innerHTML = priceSeat_C * persons + ("&euro;")

            for (var x = 0; x < classA.length; x++) {
                classA[x].checked = false;
                classB[x].checked = false;

                classA[x].disabled = true;
                classB[x].disabled = true;
                classC[x].disabled = false;

            }

            //Returns the IDs of all the taken seats and calls a function that disables these seats in the html
            fetch(`http://localhost:3000/eventReservations/${encodedEventName}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Request failed');
                    }
                    return response.json();
                })
                .then((seatIds) => {
                    disableCheckboxes(seatIds);
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                });
        }
    }



}

//Function pou kanei disable ta checkboxes pou leei to seatIds na kanei disable 
function disableCheckboxes(seatIds) {
    seatIds.forEach((seatId) => {
        const checkbox = document.getElementById(seatId);
        if (checkbox) {
            checkbox.disabled = true;
        }
    });
}

function informationForms() {
    //Disable to Control Form -- No of Persons:
    document.getElementById("numOfPersons").disabled = true

    //Disable ta 3 Radio ticket Class Boxes -- Ticket Class:
    document.getElementById("tA").disabled = true;
    document.getElementById("tB").disabled = true;
    document.getElementById("tC").disabled = true;


    //Disable ola ta checkboxes____Dhladh ola ta kathismata sto box pou emfanizetai
    var classA = document.getElementsByClassName("A")
    var classB = document.getElementsByClassName("B")
    var classC = document.getElementsByClassName("C")

    for (var x = 0; x < classA.length; x++) {
        classA[x].disabled = true;
        classB[x].disabled = true;
        classC[x].disabled = true;
    }


    console.log("got into information Forms + Disabled all previous");



    //2o Meros tou function
    //Afotou paththei to koumpi emfanizw ta forms wste o xrhsths na symplhrwsei ta stoixeia tou
    var person1 = document.getElementById("person1");
    var person2 = document.getElementById("person2");
    var person3 = document.getElementById("person3");
    var person4 = document.getElementById("person4");

    var ticketsBox = document.getElementById('personalInfo');
    var persons = document.getElementById("numOfPersons").value;
    if (persons == "1") {
        ticketsBox.style.visibility = "visible"
        person2.style.visibility = "hidden"
        person3.style.visibility = "hidden"
        person4.style.visibility = "hidden"
    } else if (persons == "2") {
        ticketsBox.style.visibility = "visible"
        person3.style.visibility = "hidden"
        person4.style.visibility = "hidden"
    } else if (persons == "3") {
        ticketsBox.style.visibility = "visible"
        person4.style.visibility = "hidden"
    } else if (persons == "4") {
        ticketsBox.style.visibility = "visible"
    }

    //Kanw hidden to Btn Confirm afou h douleia tou teleiwse
    var confirmBtn = document.getElementById("seatsConfirmBtn");
    confirmBtn.style.visibility = "hidden"

    //Kanw visible to Make reservation btn 
    var reserveBtn = document.getElementById("reservationBtn");
    reserveBtn.style.visibility = "visible"



    //3o Meros tou function
    //Ticket Class pou einai epilegmenh
    var ticketClass
    if (document.getElementById('tA').checked) {
        ticketClass = classA;
    } else if (document.getElementById('tB').checked) {
        ticketClass = classB;
    } else if (document.getElementById('tC').checked) {
        ticketClass = classC;
    }

    //Pairnei ta id twn checked checkbox

    var ticketNo = 1;
    //for gyrnaei apla ola ta checkbox apo to 0 ews to 11
    for (var x = 0; x < ticketClass.length; x++) {

        //Tsekarei an to box einai checked alliws paei sto epomeno --- ticketClass[x] = Ths antistoixhs klashs pou exei epileksei o xrhsths
        if (ticketClass[x].checked == true) {
            console.log(ticketNo);
            var placeholder = document.getElementById('ticket' + ticketNo).getAttribute('placeholder');


            if (placeholder == 'NotTaken') {
                placeholder = 'Taken';

                var id_of_checkedBox = ticketClass[x].getAttribute('id');
                var innerText = document.getElementById('ticket' + ticketNo);

                //Vazw to id ths theshs sto span text
                innerText.innerText = id_of_checkedBox;
                ++ticketNo;
            }
        }
    }

}


