function cardCheck() {
    const card1Input = document.getElementById('card1');
    const card2Input = document.getElementById('card2');
    const card3Input = document.getElementById('card3');
    const card4Input = document.getElementById('card4');

    const cardInputs = [card1Input, card2Input, card3Input, card4Input];

    cardInputs.forEach(input => {
        input.addEventListener('input', function () {
            // Remove any non-numeric characters
            this.value = this.value.replace(/\D/g, '');

            // Restrict input to 4 digits
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
    });

    //GIA TO RANDOM INPUT
    // Get the input element by its ID
    var inputRndm = document.getElementById("inputRndm");

    // Add an input event listener to the input element
    inputRndm.addEventListener("input", function () {
        // Get the input value
        var inputRndmValue = inputRndm.value;

        // Remove any non-digit characters from the input value
        var digitsOnly = inputRndmValue.replace(/\D/g, "");

        // Limit the input value to a maximum of 16 digits
        if (digitsOnly.length > 5) {
            digitsOnly = digitsOnly.slice(0, 5);
        }

        // Set the sanitized input value back to the input element
        inputRndm.value = digitsOnly;
    });
}