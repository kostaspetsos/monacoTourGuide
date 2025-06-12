function search() {
    let input = document.getElementById('input').value
    input=input.toLowerCase();
    let x = document.getElementsByClassName('container');
    let y = document.getElementsByClassName('title')
      
    for (i = 0; i < x.length; i++) { 
        if (!y[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="list-item";                 
        }
    }
}