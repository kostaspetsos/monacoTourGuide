function generateHTMLScript() {
    // Fetch the event data from MongoDB
    fetch('http://localhost:3000/getEvents')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request failed');
            }
        })
        .then(data => {
            // Iterate over each event and generate HTML for each
            data.forEach(event => {
                const time = event.time;
                const photo1 = event.photo1;
                const photo2 = event.photo2;
                const title = event.title;
                const info = event.info;

                // Create HTML elements for the event
                const container = document.createElement('div');
                container.className = 'container';
                container.setAttribute('searchTag', title);

                const row1 = document.createElement('div');
                row1.className = 'row';

                const col1 = document.createElement('div');
                col1.className = 'col';
                col1.innerHTML = `<h5>${time}</h5>`;

                row1.appendChild(col1);
                container.appendChild(row1);

                const row2 = document.createElement('div');
                row2.className = 'row';

                const col2 = document.createElement('div');
                col2.className = 'col';
                const image = document.createElement('img');
                image.id = 'eventPhoto';
                image.src = photo1;
                col2.appendChild(image);

                const hideDiv = document.createElement('div');
                hideDiv.className = 'hide';
                const hideImage = document.createElement('img');
                hideImage.id = 'hidePhoto';
                hideImage.src = photo2;
                hideDiv.appendChild(hideImage);
                col2.appendChild(hideDiv);

                row2.appendChild(col2);

                const col3 = document.createElement('div');
                col3.className = 'col-6';
                const titleElement = document.createElement('h2');
                titleElement.id = 'title';
                titleElement.className = 'title';
                titleElement.innerHTML = title;
                col3.appendChild(titleElement);

                const infoElement = document.createElement('p');
                infoElement.className = 'txt1';
                infoElement.style.textAlign = 'justify';
                infoElement.innerHTML = info;
                col3.appendChild(infoElement);

                row2.appendChild(col3);
                container.appendChild(row2);

                const row3 = document.createElement('div');
                row3.className = 'row';

                const col4 = document.createElement('div');
                col4.className = 'col-lg';
                const button = document.createElement('button');
                button.type = 'submit';
                button.className = 'btn btn-primary';
                button.setAttribute('onclick', `localStorageSet('${title}', '${photo1}')`);
                button.innerHTML = 'Reservation';
                col4.appendChild(button);

                row3.appendChild(col4);
                container.appendChild(row3);

                // Append the generated HTML to the page
                const parentContainer = document.getElementById('parentContainer');
                parentContainer.appendChild(container);
            });
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.error(error);
        });
}
