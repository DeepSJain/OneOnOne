import config from '../../config';

import { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

import { showAlert } from '../../components/alert_box/alert_box';

import withRouter from '../with_router/with_router';

let token = localStorage.getItem("token");

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
        // localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : []
    }

    componentDidMount() {
        fetch(config.API_URL + "/api/events/details/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                showAlert("Error fetching events", "error");
                window.location.href = "/";
                // this.props.navigate("/");
                return;
            }

            this.setState({events: data.events});
            // localStorage.setItem("events", JSON.stringify(data.events));
        });
    }

    toCalendarEvents(event) {
        let calendar_events = [];

        event.time_slots.forEach(timeslot => {
            calendar_events.push({
                id: timeslot.id,
                start: timeslot.start_time,
                end: timeslot.end_time,
                display: 'background',
                color: config.colors.priority_int_to_color[timeslot.priority]
            });
        });

        event.contacts.forEach(contact => {
            if (contact.meeting_scheduled) {
                calendar_events.push({
                    title: contact.name,
                    start: contact.meeting_start_time,
                    end: contact.meeting_end_time,
                    color: '#aa0000'
                });
            }
        });

        return calendar_events;
    }

    render() {
        return (
            <div className="events">
                {this.state.events.length === 0 ? <h3 className="text-center">No events found</h3> : null}
                {this.state.events.map(event => {
                    let any_meetings_scheduled = event.contacts.some(contact => contact.meeting_scheduled);
                    let all_meetings_scheduled = event.contacts.every(contact => contact.meeting_scheduled);
                    // let passed_deadline = new Date(event.deadline) < new Date();
                    let any_contacts_responded = event.contacts.some(contact => contact.availability_set);
                    let all_contacts_responded = event.contacts.every(contact => contact.availability_set);

                    let status;
                    if (event.time_slots.length === 0) {
                        status = "No availability set";
                    } else if (event.contacts.length === 0) {
                        status = "No contacts added";
                    } else if (all_meetings_scheduled) {
                        status = "All meetings scheduled";
                    } else if (any_meetings_scheduled) {
                        status = "Some meetings scheduled";
                    } else if (all_contacts_responded) {
                        status = "All contacts responded";
                    } else if (any_contacts_responded) {
                        status = "Some contacts responded";
                    } else {
                        status = "No contacts responded";
                    }

                    // <div className="event card border rounded-box hover:bg-base-300" onClick={() => window.location.href = `/events/${event.id}/`} key={event.id}>
                    return (
                        <div className="event card border rounded-box hover:bg-base-300" onClick={() => this.props.navigate(`/events/${event.id}/`)} key={event.id}>
                            <h3 className="card-title event-center mt-2">{event.name}</h3>
                            {/* <div id={`calendar-${event.id}`} className="home-calendar m-2"></div> */}
                            <FullCalendar 
                                // id={`calendar-${event.id}`}
                                // className="home-calendar m-2"
                                plugins={[ timeGridPlugin ]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: false,
                                    center: false,
                                    right: false,
                                }}
                                allDaySlot={false}
                                selectable={false}
                                editable={false}
                                longPressDelay={250}
                                unselectAuto={false}
                                scrollTime='08:00:00'
                                initialDate={new Date()}
                                
                                events={this.toCalendarEvents(event)}
                            />
                            <h6 className="event-center text-gray-500 mb-2">
                                <span className="font-bold">Status:</span> {status}
                                <br></br>
                                <span className="font-bold">Deadline:</span> {new Date(event.deadline).toLocaleString()}
                            </h6>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default withRouter(Events);