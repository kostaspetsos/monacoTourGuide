function reservationDetails () {
    // Kanw visible to reservationInfo 
    var resInfo = document.getElementById("reservationInfo");
    resInfo.style.visibility = 'visible';

    // Kanw disable ta ticket kai to koumpi tous
    var person1 = document.getElementById("person1");
    var person2 = document.getElementById("person2");
    var person3 = document.getElementById("person3");
    var person4 = document.getElementById("person4");
    var confirmBtn = document.getElementById("reservationBtn");

    //Me ta pointer events den epitrepw kanena interaction me to pontiki
    person1.style.pointerEvents = 'none';
    person2.style.pointerEvents = 'none';
    person3.style.pointerEvents = 'none';
    person4.style.pointerEvents = 'none';
    confirmBtn.style.visibility = 'hidden';
    
    var rndm = document.getElementById('securityCode');

    // Generate a random number between 0 and 99999
    const randomNumber = Math.floor(Math.random() * 100000);

    // If the number is less than 10000, pad it with leading zeros
    const paddedNumber = randomNumber.toString().padStart(5, "0");

    rndm.innerText = paddedNumber;
}