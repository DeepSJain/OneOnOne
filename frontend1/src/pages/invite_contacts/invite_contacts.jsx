import config from '../../config';

import { Component } from 'react';
import { useParams } from 'react-router-dom';

import { showAlert } from '../../components/alert_box/alert_box';

import TitleInstructions from '../../components/title_instructions/title_instructions';
import { NavigationButtons, back, get_param } from '../../components/navigation_buttons/navigation_buttons';
import BaseApp from '../../components/base_app/base_app';

let token = localStorage.getItem("token");

class InviteContacts extends Component {
    constructor(props) {
        super(props);

        this.event_id = this.props.event_id;

        this.state = {
            contacts: [],
            event_contacts: []
        };
        this.searchContacts = this.searchContacts.bind(this);
        this.addContact = this.addContact.bind(this);
        this.addEventContact = this.addEventContact.bind(this);
        // this.sendReminder = this.sendReminder.bind(this);
    }

    componentDidUpdate() {
        this.searchContacts();
    }
    
    componentDidMount() {
        const fetchAllContacts = (page=1, all=[]) => {
            fetch(config.API_URL + "/api/contacts/?page=" + page, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => {
                let results = data.results;
                if (results === undefined) {
                    showAlert("Error fetching contacts", "error");
                    window.location.href = "/";
                }
                
                all = all.concat(results);
                
                if (data.next) {
                    fetchAllContacts(page+1, all);
                    return;
                }
                
                this.setState({contacts: all});
            });
        }
        const fetchAllEventContacts = (page=1, all=[]) => {
            fetch(config.API_URL + "/api/event_contacts/?page=" + page + "&event=" + this.event_id, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => {
                let {results} = data;
                if (results === undefined) {
                    showAlert("Error fetching  event contacts", "error");
                    window.location.href = "/";
                }
                
                all = all.concat(results);
                
                if (data.next) {
                    fetchAllEventContacts(page+1, all);
                    return;
                }
                
                this.setState({event_contacts: all});
            });
        }

        fetchAllContacts();
        fetchAllEventContacts();
    }

    addContact() {
        fetch(config.API_URL + "/api/contacts/", {
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

    addEventContact(contact_id) {
        fetch(config.API_URL + "/api/event_contacts/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event: this.event_id,
                contact: contact_id
            })
        }).then(response => response.json()).then(data => {
            if (data.id === undefined) {
                if (data.detail) {
                    showAlert(data.detail, "error");
                    return;
                }
                
                showAlert("Error inviting contact", "error");
                return;
            }

            let {event_contacts} = this.state;
            event_contacts.push(data);
            this.setState({event_contacts: event_contacts});
            showAlert("Contact invited", "success");
        });
    }

    // sendReminder(event_contact_id) {
    //     fetch(config.API_URL + "/api/event_contacts/" + event_contact_id + "/send_reminder/", {
    //         method: "POST",
    //         headers: {
    //             "Authorization": `Bearer ${token}`
    //         }
    //     }).then(response => {
    //         console.log(response);
    //         if (response.status === 200) {
    //             let {event_contacts} = this.state;
    //             event_contacts.find(event_contact => event_contact.id === event_contact_id).reminded = true;
    //             this.setState({event_contacts: event_contacts});
    //             showAlert("Reminder sent", "success");
    //         } else {
    //             showAlert("Error sending reminder", "error");
    //         }
    //     });
    // }

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
            <div>
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
                                {this.state.event_contacts.some(event_contact => event_contact.contact === contact.id) ? null : <button className="btn btn-primary table-action-button" onClick={() => this.addEventContact(contact.id)}>Invite</button>}
                                {this.state.event_contacts.some(event_contact => event_contact.contact === contact.id) ? <button className="btn btn-primary table-action-button" disabled>Invited</button> : null}
                                {/* {this.state.event_contacts.some(event_contact => event_contact.contact === contact.id && !event_contact.reminded) ? <button className="btn btn-primary table-action-button" onClick={() => this.sendReminder(this.state.event_contacts.find(event_contact => event_contact.contact === contact.id).id)}>Remind</button> : null}
                                {this.state.event_contacts.some(event_contact => event_contact.contact === contact.id && event_contact.reminded) ? <button className="btn btn-primary table-action-button" disabled>Reminded</button> : null} */}
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
            </div>
        );
    }
}

function Main() {
    let { event_id } = useParams();
    return (
        <main className="prose p-4">
            <TitleInstructions title="Invite Contacts" instructions="Select the contacts you would like to invite to your event." />
            <div className="divider"></div>
            <InviteContacts event_id={event_id} />
            <div className="divider"></div>
            {get_param("next") !== null ? <NavigationButtons back={{label: "Back", onClick: back}} next={{label: "Next", onClick: () => window.location.href = get_param("next")}} /> : <NavigationButtons back={{label: "Back", onClick: back}} />}
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/events/" is_nav={true} />
    );
}

export default App;