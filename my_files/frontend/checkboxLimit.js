function checkboxLimit(classN) {
    var confirmBtn = document.getElementById("seatsConfirmBtn");
    var checkboxgroup = document.getElementsByClassName(classN);

    var persons = document.getElementById("numOfPersons").value;
    var limit = 0;

    if (persons === "1") {
        limit = 1;
    } else if (persons === "2") {
        limit = 2;
    } else if (persons === "3") {
        limit = 3;
    } else if (persons === "4") {
        limit = 4;
    }

    console.log("User can't select more than: " + limit + " seats.");


    for (var i = 0; i < checkboxgroup.length; i++) {
        checkboxgroup[i].onclick = function () {
            var checkedcount = 0;
            for (var i = 0; i < checkboxgroup.length; i++) {
                checkedcount += (checkboxgroup[i].checked) ? 1 : 0;
            }
            if (checkedcount > limit) {
                console.log("You can select maximum of " + limit + " seats.");
                alert("You can select maximum of " + limit + " seats.");
                this.checked = false;
            } else if (checkedcount == limit) {
                confirmBtn.style.visibility = 'visible';
            } else if (checkedcount < limit) {
                confirmBtn.style.visibility = 'hidden';
            }

        }
    }


}