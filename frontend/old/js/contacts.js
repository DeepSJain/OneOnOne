function back() {
    history.back();
}

function searchContacts() {
    let input = document.getElementById("search-contacts");
    let filter = input.value.toUpperCase();
    let contacts = document.getElementsByClassName("contact-row");
    let found = false;
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].children[0].innerText;
        let email = contacts[i].children[1].innerText;
        if (name.toUpperCase().indexOf(filter) > -1 || email.toUpperCase().indexOf(filter) > -1) {
            contacts[i].style.display = "";
            found = true;
        } else {
            contacts[i].style.display = "none";
        }
    }

    if (!found) {
        document.getElementById("no-results").hidden = false;
    } else {
        document.getElementById("no-results").hidden = true;
    }
}

function deleteContact(element) {
    element.parentElement.parentElement.remove();
}

function addContactButton() {
    document.getElementById("submit-add-contact-form").click();
}

function addContact() {
    let name = document.getElementById("new-contact-name").value;
    let email = document.getElementById("new-contact-email").value;

    let contacts_table = document.getElementById("contacts-table");

    let td = document.createElement("td");
    td.innerText = name;
    let td2 = document.createElement("td");
    td2.innerText = email;
    let td3 = document.createElement("td");
    let button = document.createElement("button");
    button.innerText = "Delete";
    button.onclick = function () {
        this.parentElement.parentElement.remove();
    };
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("table-action-button");
    td3.appendChild(button);

    let tr = contacts_table.getElementsByTagName("tbody")[0].insertRow(contacts_table.getElementsByTagName("tbody")[0].children.length - 1);
    tr.classList.add("contact-row");
    tr.appendChild(td);
    tr.appendChild(td2);
    tr.appendChild(td3);

    document.getElementById("new-contact-name").value = "";
    document.getElementById("new-contact-email").value = "";

    document.getElementById("search-contacts").value = "";
    searchContacts();
}