import config from '../../config';
import React from "react";

import { showAlert } from "../alert_box/alert_box";

import withRouter from "../with_router/with_router";
import { Link } from "react-router-dom";

let token = localStorage.getItem("token");

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            events: localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : []
        }
    }

    componentDidMount() {
        if (!token) {
            window.location.href = "/";
            // this.props.navigate("/");
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
                    // this.props.navigate("/");
                    return;
                }
                
                all = all.concat(events);
                
                if (data.next) {
                    fetchAll(page+1, all);
                    return;
                }
                
                this.setState({events: all});
                localStorage.setItem("events", JSON.stringify(all));
            });
        }

        fetchAll();
    }

    render() {
        return (
            <nav className="drawer-side z-40">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content flex-col flex">
                    <li><Link className={window.location.pathname.split("?")[0] === "/events/" ? "bg-base-300" : ""} to="/events/">Home</Link></li>
                    <li><Link className={window.location.pathname.startsWith("/contacts/") ? "bg-base-300" : ""} to="/contacts/">Contacts</Link></li>
                    <li><Link className={window.location.pathname.startsWith("/create_event/") ? "bg-base-300" : ""} to="/create_event/">Create Event</Link></li>
                    {this.state.events.length === 0 ? "" : <li><Link className={window.location.pathname.startsWith("/summary/") ? "bg-base-300" : ""} to="/summary/">Summary</Link></li>}
                    <div tabIndex="0" className="collapse collapse-open">
                        <div className="pt-2 pb-2 pl-4 h-auto">{this.state.events.length === 0 ? "" : "Your Events"}</div>
                        <div className="collapse-content"> 
                            {this.state.events.map(event => {
                                return (
                                    <li key={event.id}>
                                        <Link className={window.location.pathname.startsWith(`/events/${event.id}/`) ? "bg-base-300" : ""} to={`/events/${event.id}/`}>{event.name}</Link>
                                    </li>
                                )
                            })}
                        </div>
                    </div>
                    <li className="grow bg-base-200"></li>
                    <li><Link className={window.location.pathname.startsWith("/settings/") ? "bg-base-300" : ""} to="/settings/">Settings</Link></li>
                    <li><Link className={window.location.pathname.startsWith("/logout/") ? "bg-base-300" : ""} to="/logout/">Logout</Link></li>
                </ul>
            </nav>
        );
    }
}

export default withRouter(Nav);