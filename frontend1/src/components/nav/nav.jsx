import config from '../../config';
import React from "react";

import { showAlert } from "../alert_box/alert_box";

let token = localStorage.getItem("token");

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        if (!token) {
            window.location.href = "/";
            return;
        }

        const fetchAll = (page=1, all=[]) => {
            fetch(config.API_URL + "/api/events/?page=" + page, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => {
                let events = data.results;
                if (events === undefined) {
                    showAlert("Error fetching events", "error");
                    window.location.href = "/";
                    return;
                }
                
                all = all.concat(events);
                
                if (data.next) {
                    fetchAll(page+1, all);
                    return;
                }
                
                this.setState({events: all});
            });
        }

        fetchAll();
    }

    render() {
        return (
            <nav className="drawer-side z-40">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content flex-col flex">
                    <li><a className={window.location.pathname.split("?")[0] === "/events/" ? "bg-base-300" : ""} href="/events/">Home</a></li>
                    <li><a className={window.location.pathname.startsWith("/contacts/") ? "bg-base-300" : ""} href="/contacts/">Contacts</a></li>
                    <li><a className={window.location.pathname.startsWith("/create_event/") ? "bg-base-300" : ""} href="/create_event/">Create Event</a></li>
                    <div tabIndex="0" className="collapse collapse-open">
                        <div className="pt-2 pb-2 pl-4 h-auto">Your Events</div>
                        <div className="collapse-content"> 
                            {this.state.events.map(event => {
                                return (
                                    <li key={event.id}>
                                        <a className={window.location.pathname.startsWith(`/events/${event.id}/`) ? "bg-base-300" : ""} href={`/events/${event.id}/`}>{event.name}</a>
                                    </li>
                                )
                            })}
                        </div>
                    </div>
                    <li className="grow bg-base-200"></li>
                    <li><a className={window.location.pathname.startsWith("/settings/") ? "bg-base-300" : ""} href="/settings/">Settings</a></li>
                    <li><a className={window.location.pathname.startsWith("/logout/") ? "bg-base-300" : ""} href="/logout/">Logout</a></li>
                </ul>
            </nav>
        );
    }
}

export default Nav;