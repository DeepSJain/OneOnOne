let token = localStorage.getItem("token");
if (!token) {
    showAlert("You must be logged in to view this page", "error");
    window.location.href = "/";
}


class Contacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: []
        };
        this.addContact = this.addContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.searchContacts = this.searchContacts.bind(this);
    }

    componentDidUpdate() {
        this.searchContacts();
        // localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
    }    
    
    componentDidMount() {
        const fetchAll = (page=1, all=[]) => {
            fetch("/api/contacts/?page=" + page, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => {
                let contacts = data.results;
                if (contacts === undefined) {
                    showAlert("Error fetching contacts", "error");
                    window.location.href = "/";
                }
                
                all = all.concat(contacts);
                
                if (data.next) {
                    fetchAll(page+1, all);
                    return;
                }
                
                this.setState({contacts: all});
            });
        }

        fetchAll();
    }

    deleteContact(id) {
        fetch(`/api/contacts/${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if (response.status !== 204) {
                showAlert("Error deleting contact", "error");
                return;
            }

            this.setState({contacts: this.state.contacts.filter(contact => contact.id !== id)});
            showAlert("Contact deleted", "success");
        });
    }

    addContact() {
        fetch("/api/contacts/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById("new-contact-name").value,
                email: document.getElementById("new-contact-email").value
            })
        }).then(response => response.json()).then(data => {
            if (data.id === undefined) {
                if (data.name) {
                    showAlert("Name: " + data.name, "error");
                    return;
                } else if (data.email) {
                    showAlert("Email: " + data.email, "error");
                    return;
                } else if (data.detail) {
                    showAlert(data.detail, "error");
                    return;
                }
                
                showAlert("Error adding contact", "error");
                return;
            }

            let {contacts} = this.state;
            contacts.push(data);
            this.setState({contacts: contacts});
            document.getElementById("new-contact-name").value = "";
            document.getElementById("new-contact-email").value = "";
            showAlert("Contact added", "success");
        });
    }

    searchContacts() {
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
            document.getElementById("no-results").style.display = "block";
        } else {
            document.getElementById("no-results").hidden = true;
            document.getElementById("no-results").style.display = "none";
        }
    }

    render() {
        const {contacts} = this.state;
        return (
            <table className="table table-zebra table-bordered table-hover" id="contacts-table">
                <thead className="contact-no-list">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email Address</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <div className="contact-no-list">
                        <tr id="search-contacts-row">
                            <td colSpan="3">
                            <input type="text" id="search-contacts" name="search" className="input input-bordered" placeholder="Search Contacts" onKeyUp={this.searchContacts}></input>
                            </td>
                        </tr>
                        <tr id="no-results" hidden>
                            <td colSpan="3">
                                No results found.
                            </td>
                        </tr>
                    </div>
                    <div id="contact-list">
                        {contacts.map(contact => (
                        <tr className="contact-row" key={contact.id}>
                            <td spellCheck="false">{contact.name}</td>
                            <td spellCheck="false">{contact.email}</td>
                            <td>
                                <button className="btn btn-primary table-action-button" onClick={() => this.deleteContact(contact.id)}>Delete</button>
                            </td>
                        </tr>
                        ))}
                    </div>
                    <div className="contact-no-list">
                        <tr>
                            <td>
                                <input type="text" id="new-contact-name" name="new-contact-name" className="input input-bordered new-contact-input" placeholder="Name" required></input>
                            </td>
                            <td>
                                <input type="email" id="new-contact-email" name="new-contact-email" className="input input-bordered new-contact-input" placeholder="Email Address" required></input>
                            </td>
                            <td>
                                <input id="new-contact-submit" type="submit" hidden></input>
                                <button className="btn btn-primary table-action-button"onClick={this.addContact}>Add</button>
                            </td>
                        </tr>
                    </div>
                </tbody>
            </table>
        );
    }
}

function Main() {
    return (
        <main className="prose p-4">            
            <AlertBox />
            <TitleInstructions title="Contacts" instructions="Update your contacts list" />
            <Divider />
            <Contacts />
            <Divider />
            <NavigationButtons back={{label: "Back", onClick: back}} />
        </main>
    );
}

function Page() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle"></input>
            <div className="drawer-content">
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <Main />
                    <Footer />
                </div>
            </div>
            <Nav />
        </div>
    );
}