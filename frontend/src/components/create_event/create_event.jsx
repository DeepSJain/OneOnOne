import config from '../../config';

import { Component } from 'react';

import { showAlert } from '../../components/alert_box/alert_box';

import withRouter from '../../components/with_router/with_router';

let token = localStorage.getItem("token");

class CreateEvent extends Component {
    constructor(props) {
        super(props);

        this.create = this.create.bind(this);
    }
    
    create(event) {
        event.preventDefault();

        let name = document.getElementById("event_name").value;
        let deadline = document.getElementById("event_deadline").value;

        fetch(config.API_URL + "/api/events/", {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "name": name,
                "deadline": deadline
            })
        }).then(response => response.json()).then(data => {
            if (data.id === undefined) {
                if (data.name) {
                    showAlert("Name: " + data.name, "error");
                    return;
                } else if (data.deadline) {
                    showAlert("Deadline: " + data.deadline, "error");
                    return;
                } else if (data.detail) {
                    showAlert(data.detail, "error");
                    return;
                }
                
                showAlert("Error creating event", "error");
                return;
            }

            showAlert("Event created", "success");
            // setTimeout(() => window.location.href = `/events/${data.id}/set_availability/?next=/events/${data.id}/invite_contacts/%3Fnext=/events/${data.id}/`, 1000);
            setTimeout(() => this.props.navigate(`/events/${data.id}/set_availability/?next=/events/${data.id}/invite_contacts/%3Fnext=/events/${data.id}/`), 1000);
        });
    }

    render() {
        return (
            <div className="action_row">
                <form onSubmit={this.create} id="create-form">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="event_name">Event Name:</label>
                                </td>
                                <td>
                                    <input type="text" id="event_name" name="event_name" className="m-2 input input-bordered w-full" placeholder="Event Name" required></input>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="event_deadline">Event Deadline:</label>
                                </td>
                                <td>
                                    <input type="datetime-local" id="event_deadline" name="event_deadline" className="m-2 input input-bordered w-full" required></input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="submit" id="submit-create-form" hidden>Submit</button>
                </form>
            </div>
        );
    }
}

export default withRouter(CreateEvent);