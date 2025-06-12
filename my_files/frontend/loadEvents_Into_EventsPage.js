function fetchEvents() {
    fetch('http://localhost:3000/getEvents')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch events');
            }
        })
        .then(events => {
            const container = document.querySelector('.my-container');
            events.forEach(event => {
                const box = document.createElement('div');
                box.classList.add('box');

                const div = document.createElement('div');
                div.classList.add('container');
                div.setAttribute('searchTag', event.title);

                // Add 'disabled' class to the container if disableEvent is true
                if (event.disableEvent) {
                    div.classList.add('disabled');
                }

                const row1 = document.createElement('div');
                row1.classList.add('row');

                const col1 = document.createElement('div');
                col1.classList.add('col');
                col1.setAttribute('id', 'time');
                col1.style.marginBottom = '10px'; // Add margin to create space

                const h5 = document.createElement('h5');
                h5.textContent = event.date;

                col1.appendChild(h5);
                row1.appendChild(col1);
                div.appendChild(row1);

                const row2 = document.createElement('div');
                row2.classList.add('row');

                const col2 = document.createElement('div');
                col2.classList.add('col-md-6');
                col2.setAttribute('id', 'picture');

                const img1 = document.createElement('img');
                img1.setAttribute('id', 'eventPhoto');
                img1.setAttribute('src', event.photo1);
                img1.style.width = '100%'; // Set the width to 100% of the container
                img1.style.height = 'auto'; // Automatically adjust the height
                img1.classList.add('eventPhoto'); // Add the CSS class

                const hideDiv = document.createElement('div');
                hideDiv.classList.add('hide');

                const img2 = document.createElement('img');
                img2.setAttribute('id', 'hidePhoto');
                img2.setAttribute('src', event.photo2);
                img2.style.width = '100%'; // Set the width to 100% of the container
                img2.style.height = 'auto'; // Automatically adjust the height

                hideDiv.appendChild(img2);
                col2.appendChild(img1);
                col2.appendChild(hideDiv);
                row2.appendChild(col2);

                const col3 = document.createElement('div');
                col3.classList.add('col-md-6');
                col3.setAttribute('id', 'information');

                const title = document.createElement('h2');
                title.classList.add('title');
                title.textContent = event.title;

                const p = document.createElement('p');
                p.classList.add('txt1');
                p.style.textAlign = 'justify';
                p.textContent = event.info;

                col3.appendChild(title);
                col3.appendChild(p);
                row2.appendChild(col3);

                div.appendChild(row2);

                const row3 = document.createElement('div');
                row3.classList.add('row');

                const col4 = document.createElement('div');
                col4.classList.add('col-lg');
                col4.setAttribute('id', 'link');

                const button = document.createElement('button');
                button.setAttribute('type', 'submit');
                button.classList.add('btn', 'btn-primary');
                button.textContent = 'Reservation';
                button.addEventListener('click', function () {
                    localStorageSet(event.title, event.photo1);
                });

                col4.appendChild(button);
                row3.appendChild(col4);
                div.appendChild(row3);

                box.appendChild(div);
                container.appendChild(box);
            });
        })
        .catch(error => {
            console.error(error);
        });
}