function loadUsers() {
  fetch('http://localhost:3000/getUsers')
    .then((response) => response.json())
    .then((users) => {
      const tableBody = document.querySelector('#users-table tbody');

      users.forEach((user) => {
        const row = document.createElement('tr');
        const firstNameCell = document.createElement('td');
        const firstNameInput = document.createElement('input');
        firstNameInput.type = 'text';
        firstNameInput.className = 'form-control';
        firstNameInput.value = user.firstname;
        firstNameInput.id = `firstName-${user._id}`;
        firstNameInput.disabled = true;
        firstNameCell.appendChild(firstNameInput);
        row.appendChild(firstNameCell);

        const lastNameCell = document.createElement('td');
        const lastNameInput = document.createElement('input');
        lastNameInput.type = 'text';
        lastNameInput.className = 'form-control';
        lastNameInput.value = user.lastname;
        lastNameInput.id = `lastName-${user._id}`;
        lastNameInput.disabled = true;
        lastNameCell.appendChild(lastNameInput);
        row.appendChild(lastNameCell);

        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;
        row.appendChild(usernameCell);

        const passwordCell = document.createElement('td');
        passwordCell.textContent = user.password;
        row.appendChild(passwordCell);

        const emailCell = document.createElement('td');
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.className = 'form-control';
        emailInput.value = user.email;
        emailInput.id = `email-${user._id}`;
        emailInput.disabled = true;
        emailCell.appendChild(emailInput);
        row.appendChild(emailCell);

        const editCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
          firstNameInput.disabled = false;
          lastNameInput.disabled = false;
          emailInput.disabled = false;
          editButton.disabled = true;
          saveButton.disabled = false;
        });
        editCell.appendChild(editButton);

        const saveCell = document.createElement('td');
        const saveButton = document.createElement('button');
        saveButton.classList.add('btn', 'btn-success');
        saveButton.textContent = 'Save';
        saveButton.disabled = true;
        saveButton.addEventListener('click', () => {
          const editedUser = {
            firstname: firstNameInput.value,
            lastname: lastNameInput.value,
            email: emailInput.value,
          };

          console.log("User ID is: "+user._id);
          fetch('http://localhost:3000/editUser', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user._id,
              editedUser: editedUser,
            }),
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.success) {
                alert('User updated successfully!');
                firstNameInput.disabled = true;
                lastNameInput.disabled = true;
                emailInput.disabled = true;
                editButton.disabled = false;
                saveButton.disabled = true;
              } else {
                alert('An error occurred while updating user!');
              }
            })
            .catch((error) => {
              console.log(error);
              alert('An error occurred while updating user!');
            });
        });
        saveCell.appendChild(saveButton);
        row.appendChild(editCell);
        row.appendChild(saveCell);

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.log(error);
      alert('An error occurred while fetching users!');
    });
}
