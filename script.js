var form = document.querySelector("#form");
var table = document.querySelector("#table");

form.addEventListener("submit", function(){
    event.preventDefault();
    var name = document.querySelector("#name").value;
    var sem = document.querySelector("#sem").value;
    
    var data = createList(name, sem);
    table.appendChild(data);
})
function createList(name, sem){
    var row = document.createElement('tr');

    var nameColumn = document.createElement('td');
    nameColumn.innerText = name;

    var ageColumn = document.createElement('td');
    ageColumn.innerText = sem;
    

    var actionColumn = document.createElement('td');
    var editButton = document.createElement('button');
    editButton.innerText = "Edit";

    editButton.addEventListener('click', function(){
        var updatedName = prompt('Edit name:', name);
        var updatedage = prompt('Edit sem:', sem);

        if(updatedName !== null && 
            updatedage !== null){
                nameColumn.innerText = updatedName;
                ageColumn.innerText = updatedage;
        }
    });

    var deleteButton = document.createElement('button');
    deleteButton.innerText = "delete";
    deleteButton.addEventListener('click', function(){
        table.removeChild(row);
    });

    actionColumn.appendChild(editButton);
    actionColumn.appendChild(deleteButton);

    row.appendChild(nameColumn);
    row.appendChild(ageColumn);
    row.appendChild(actionColumn);

    return row
}
