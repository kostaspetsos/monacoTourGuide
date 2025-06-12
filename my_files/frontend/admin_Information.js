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
            textP1_input.value = textP1;

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
            textP2_input.value = textP2;

        })
        .catch(error => {
            console.error(error);
        });
}

// Function to update Paragraph 1
async function updateP1() {
    // Get the updated text from the textarea
    const updatedText = document.getElementById('textP1').value;
  
    // Create the request body
    const requestBody = {
      first_paragraph: updatedText
    };
  
    try {
      // Make the POST request to update the text
      const response = await fetch('http://localhost:3000/updateP1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (response.ok) {
        // Show success message
        document.getElementById('successMessage').classList.remove('d-none');
      } else {
        // Show error message
        console.error('Failed to update text:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update text:', error);
    }
  }


  // Function to update Paragraph 2
  async function updateP2() {
    // Get the updated text from the textarea
    const updatedText = document.getElementById('textP2').value;
  
    // Create the request body
    const requestBody = {
      second_paragraph: updatedText
    };
  
    try {
      // Make the POST request to update the text
      const response = await fetch('http://localhost:3000/updateP2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (response.ok) {
        // Show success message
        document.getElementById('successMessage').classList.remove('d-none');
      } else {
        // Show error message
        console.error('Failed to update text:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update text:', error);
    }
  }