function get_param(key) {
    let url = new URL(window.location.href);
    return url.searchParams.get(key);
}

function goToConfirmation() {
    let url = get_param('next');
    if (url == null) {
        url = "confirmation.html?title=" + encodeURI("Succesfully Invited Contacts") + "&instructions=" + encodeURI("Your contacts have been invited to your event. You can check back later to see your event's status.");
    }
    window.location.href = url;
}

function selectAll() {
    let contacts = document.getElementsByClassName("contact-row");
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].style.display !== "none") {
            contacts[i].children[2].children[0].checked = true;
        }
    }
}

function clearSelection() {
    let contacts = document.getElementsByClassName("contact-row");
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].style.display !== "none") {
            contacts[i].children[2].children[0].checked = false;
        }
    }
}

function back() {
    history.back();
}

function updateContacts() {
    window.location.href = "contacts.html";
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

function selectRow(row) {
    let checkbox = row.children[2].children[0];
    checkbox.checked = !checkbox.checked;
}