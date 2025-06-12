function loadParagraphs() {
    let textP1
    let textP2

    fetch('http://localhost:3000/informationFirstP')
        .then(response => response.text())
        .then(data => {
            // Do something with the content of the paragraph
            //console.log(data);

            textP1 = data;
            textP1_input = document.getElementById("textP1");
            textP1_input.innerText = textP1;

        })
        .catch(error => {
            console.error(error);
        });

    fetch('http://localhost:3000/informationSecondP')
        .then(response => response.text())
        .then(data => {
            // Do something with the content of the paragraph
            //console.log(data);

            textP2 = data;
            textP2_input = document.getElementById("textP2");
            textP2_input.innerText = textP2;

        })
        .catch(error => {
            console.error(error);
        });
}