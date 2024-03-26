import config from '../../config';

import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"

import { showAlert } from '../../components/alert_box/alert_box';

import withRouter from '../../components/with_router/with_router';

let token = localStorage.getItem("token");

class Event extends Component {
    constructor(props) {
        super(props);

        this.event_id = this.props.event_id;

        this.calendar = createRef();

        this.state = {
            event: undefined,
            event_contacts: [],
            timeslots: [],
            show_timeslots: [],
            show_contact: undefined,
            proposed_meeting_times: []
        };

        this.showContactAvailability = this.showContactAvailability.bind(this);
        this.hideContactAvailability = this.hideContactAvailability.bind(this);
        this.removeContact = this.removeContact.bind(this);
        this.sendReminder = this.sendReminder.bind(this);
        this.getPossibleMeetingTimes = this.getPossibleMeetingTimes.bind(this);

        this.eventUpdateStart = this.eventUpdateStart.bind(this);
        this.eventUpdateStop = this.eventUpdateStop.bind(this);
        this.eventUpdateAfter = this.eventUpdateAfter.bind(this);
        this.saveAndSendConfirmations = this.saveAndSendConfirmations.bind(this);

        this.getCalendarApi = this.getCalendarApi.bind(this);

        this.formatDate = this.formatDate.bind(this);

        this.updateAvailibility = this.updateAvailibility.bind(this);
        this.inviteMoreContacts = this.inviteMoreContacts.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);

        this.getCalendarEvents = this.getCalendarEvents.bind(this);

        this.eventClick = this.eventClick.bind(this);
    }

    getCalendarApi() {
        return this.calendar.current.getApi();
    }

    formatDate(date) {
        return date.split("T")[0] + " " + date.split("T")[1].split("Z")[0];
    }

    updateAvailibility() {
        // window.location.href = `/events/${this.event_id}/set_availability/`;
        this.props.navigate(`/events/${this.event_id}/set_availability/`);
    }
    
    inviteMoreContacts() {
        // window.location.href = `/events/${this.event_id}/invite_contacts/`;
        this.props.navigate(`/events/${this.event_id}/invite_contacts/`);
    }
    
    deleteEvent() {
        fetch(config.API_URL + `/api/events/${this.event_id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 204) {
                showAlert("Event deleted", "success");
                // setTimeout(() => window.location.href = "/events/", 1000);
                setTimeout(() => this.props.navigate("/events/"), 1000);
                return;
            } 
            showAlert("Error deleting event", "error");
        });
    }
    
    eventUpdateStart(info) {
        this.before_update_events = this.getCalendarApi().getEvents();
        let event_contact_id = info.event.id.split("proposed-meeting-")[1];
        
        let event_contact = this.state.event_contacts.filter(contact => contact.id == event_contact_id)[0];
        let contact_availability = event_contact.timeslots;

        let my_availability = this.state.timeslots;

        let availability_overlaps = [];
        for (let i = 0; i < contact_availability.length; i++) {
            for (let j = 0; j < my_availability.length; j++) {
                if (contact_availability[i].start_time < my_availability[j].end_time && contact_availability[i].end_time > my_availability[j].start_time) {
                    let start_time = contact_availability[i].start_time > my_availability[j].start_time ? contact_availability[i].start_time : my_availability[j].start_time;
                    let end_time = contact_availability[i].end_time < my_availability[j].end_time ? contact_availability[i].end_time : my_availability[j].end_time;
                    let priority = 1;  // let priority = contact_availability[i].priority > my_availability[j].priority ? contact_availability[i].priority : my_availability[j].priority;
                    availability_overlaps.push({id: event_contact_id, start_time, end_time, priority});
                } else if (contact_availability[i].start_time < my_availability[j].start_time && contact_availability[i].end_time > my_availability[j].end_time) {
                    let {start_time, end_time} = my_availability[j];
                    let priority = 1;  // let priority = contact_availability[i].priority > my_availability[j].priority ? contact_availability[i].priority : my_availability[j].priority;
                    availability_overlaps.push({id: event_contact_id, start_time, end_time, priority});
                } else if (contact_availability[i].start_time > my_availability[j].start_time && contact_availability[i].end_time < my_availability[j].end_time) {
                    let {start_time, end_time} = contact_availability[i];
                    let priority = 1;  // let priority = contact_availability[i].priority > my_availability[j].priority ? contact_availability[i].priority : my_availability[j].priority;
                    availability_overlaps.push({id: event_contact_id, start_time, end_time, priority});
                } else if (contact_availability[i].start_time === my_availability[j].start_time && contact_availability[i].end_time === my_availability[j].end_time) {
                    let {start_time, end_time} = contact_availability[i];
                    let priority = 1;  // let priority = contact_availability[i].priority > my_availability[j].priority ? contact_availability[i].priority : my_availability[j].priority;
                    availability_overlaps.push({id: event_contact_id, start_time, end_time, priority});
                }
            }
        }

        this.getCalendarApi().getEvents().forEach(event => {
            if (!event.id.startsWith("proposed-meeting-") && !event.id.startsWith("meeting-")) {
                event.remove();
            }
        });

        availability_overlaps.forEach(overlap => {
            this.getCalendarApi().addEvent({
                id: "overlap-" + overlap.id,
                start: overlap.start_time,
                end: overlap.end_time,
                display: 'background',
                color: config.colors.priority_int_to_light_color[overlap.priority]
            });
        });
    }

    eventUpdateStop(info) {
        this.getCalendarApi().getEvents().forEach(event => {
            if (!event.id.startsWith("proposed-meeting-")) {
                event.remove();
            }
        });

        this.before_update_events.forEach(event => {
            if (!event.id.startsWith("proposed-meeting-") && !event.id.startsWith("meeting-")) {
                this.getCalendarApi().addEvent({
                    id: event.id,
                    start: event.start,
                    end: event.end,
                    display: event.display,
                    color: event.backgroundColor
                });
            }
        });
    }

    eventUpdateAfter(info) {
        let event_contact_id = info.event.id.split("proposed-meeting-")[1];

        let {proposed_meeting_times} = this.state;
        for (let i = 0; i < proposed_meeting_times.length; i++) {
            if (proposed_meeting_times[i].contact_event == event_contact_id) {
                proposed_meeting_times[i].start_time = info.event.start;
                proposed_meeting_times[i].end_time = info.event.end;
            }
        }

        this.setState({proposed_meeting_times: proposed_meeting_times});
    }

    saveAndSendConfirmations() {
        let new_event_contacts = [];
        let promises = [];
        this.state.event_contacts.forEach(contact => {
            let found = false;
            this.state.proposed_meeting_times.forEach(meeting => {
                if (meeting.contact_event == contact.id) {
                    found = true;

                    let promise = fetch(config.API_URL + `/api/event_contacts/${meeting.contact_event}/schedule_meetings/`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            start_time: meeting.start_time,
                            end_time: meeting.end_time
                        })
                    }).then(response => response.json()).then(data => {
                        if (data.status !== "success") {
                            showAlert("Error saving meeting times", "error");
                            return;
                        }
                        
                        contact.meeting_scheduled = true;
                        contact.meeting_start_time = meeting.start_time;
                        contact.meeting_end_time = meeting.end_time;
                        new_event_contacts.push(contact);
                    });
                    promises.push(promise);
                }
            });

            if (!found) {
                new_event_contacts.push(contact);
            }
        });

        Promise.all(promises).then(() => {
            this.setState({proposed_meeting_times: [], event_contacts: new_event_contacts});
        });
    }

    // componentDidMount() {
    componentDidUpdate(prevProps, prevState) {
        if (this.props.event_id === prevProps.event_id) {
            return;
        }

        this.setState({event: undefined, event_contacts: [], timeslots: [], show_timeslots: [], show_contact: undefined, proposed_meeting_times: []});
        this.event_id = this.props.event_id;

        fetch(config.API_URL + `/api/events/${this.event_id}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.id === undefined) {
                showAlert("Error fetching event", "error");
                // window.location.href = "/";
                this.props.navigate("/events/");
            }

            this.setState({event: data});
            document.getElementById("title").innerText = data.name;
        });

        const fetchAllTimeslots = (page=1, all=[]) => {
            fetch(config.API_URL + "/api/events/" + this.event_id + "/availability/?page=" + page, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => {
                let {results} = data;
                if (results === undefined) {
                    showAlert("Error fetching timeslots", "error");
                    // window.location.href = "/";
                    this.props.navigate("/events/");
                }

                all = all.concat(results);

                if (data.next) {
                    fetchAllTimeslots(page+1, all);
                    return;
                }

                this.setState({timeslots: all, show_timeslots: all});
            });
        }

        fetchAllTimeslots();
        
        
        // const fetchAllEventContacts = (page=1, all=[]) => {
        //     return new Promise((resolve, reject) => {
        //         fetch(config.API_URL + "/api/event_contacts/?page=" + page + "&event=" + this.event_id, {
        //             method: "GET",
        //             headers: {
        //                 "Authorization": `Bearer ${token}`
        //             }
        //         }).then(response => response.json()).then(data => {
        //             let {results} = data;
        //             if (results === undefined) {
        //                 showAlert("Error fetching event contacts", "error");
        //                 window.location.href = "/";
        //             }
                    
        //             all = all.concat(results);
                    
        //             if (data.next) {
        //                 fetchAllEventContacts(page+1, all).then(resolve);
        //                 return;
        //             }
                    
        //             resolve(all);
        //         });
        //     });
        // }

        fetch(config.API_URL + `/api/event_contacts/details/?event_id=${this.event_id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                showAlert("Error fetching event contacts", "error");
                // window.location.href = "/";
                this.props.navigate("/events/");
                return;
            }
            
            this.setState({event_contacts: data.contact_events});
        });
    }

    showContactAvailability(contact_event) {
        this.setState({show_timeslots: contact_event.contact_event.timeslots, show_contact: contact_event.contact_event.id});
    }

    hideContactAvailability() {
        this.setState({show_timeslots: this.state.timeslots, show_contact: undefined});
    }

    removeContact(contact_event) {
        fetch(config.API_URL + `/api/event_contacts/${contact_event.contact_event.id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 204) {
                showAlert("Contact removed", "success");
                let event_contacts = this.state.event_contacts.filter(contact => contact.id !== contact_event.contact_event.id);
                this.setState({event_contacts});
                return;
            }

            showAlert("Error removing contact", "error");
        });
    }

    sendReminder(contact_event) {
        fetch(config.API_URL + `/api/event_contacts/${contact_event.contact_event.id}/send_reminder/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                showAlert("Reminder sent", "success");
                let event_contacts = this.state.event_contacts.map(contact => {
                    if (contact.id === contact_event.contact_event.id) {
                        contact.reminded = true;
                    }
                    return contact;
                });
                this.setState({event_contacts: event_contacts});
                return;
            }

            showAlert("Error sending reminder", "error");
        });
    }

    getPossibleMeetingTimes() {
        fetch(config.API_URL + `/api/events/${this.event_id}/meetings/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.status === "success") {
                if (data.meetings.length === 0) {
                    showAlert("No meeting times found", "error");
                    return;
                }
                
                this.setState({proposed_meeting_times: data.meetings});
                showAlert(`${data.meetings.length} meeting time${data.meetings.length === 1 ? "" : "s"} found`, "success");
                return;
            }

            showAlert("Error fetching meeting times", "error");
        });
    }

    // componentDidUpdate() {
    componentDidMount() {
        this.componentDidUpdate({});
        // setTimeout(() => {
        // this.getCalendarApi().render();
        // }, 100);
    }

    getCalendarEvents() {
        let calendar_events = [];

        this.state.show_timeslots.forEach(timeslot => {
            calendar_events.push({
                id: timeslot.id,
                start: timeslot.start_time,
                end: timeslot.end_time,
                display: 'background',
                color: config.colors.priority_int_to_color[timeslot.priority]
            });
        });

        this.state.proposed_meeting_times.forEach(meeting_time => {
            let contact_name = "Unknown Contact";
            for (let i = 0; i < this.state.event_contacts.length; i++) {
                if (this.state.event_contacts[i].id == meeting_time.contact_event) {
                    contact_name = this.state.event_contacts[i].contact.name;
                }
            }
            calendar_events.push({
                id: "proposed-meeting-" + meeting_time.contact_event,
                title: contact_name,
                start: meeting_time.start_time,
                end: meeting_time.end_time,
            });
        });

        this.state.event_contacts.forEach(contact_event => {
            if (contact_event.meeting_scheduled) {
                calendar_events.push({
                    id: "meeting-" + contact_event.id,
                    title: contact_event.contact.name,
                    start: contact_event.meeting_start_time,
                    end: contact_event.meeting_end_time,
                    color: config.colors.meeting_color,
                    editable: false
                });
            }
        });

        

        return calendar_events;
    }

    eventClick(info) {
        if (info.event.display === "background") {
            return;
        }

        showAlert(info.event.title, "info");
    }
    
    render() {
        return (
            <div className="event-main">
                <div className="flex w-full event-data">
                    <div className="contacts m-1/2">
                        <br></br>
                        <table className="table w-full table-compact" id="event-contacts-table">
                            <thead className="contact-no-list">
                                <tr>
                                    <th>Contacts</th>
                                    <th>Status</th>
                                    <th colSpan="2">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="contact-list">
                                {this.state.event_contacts.length === 0 ? <tr><td colSpan="3">No contacts invited</td></tr> : null}
                                {this.state.event_contacts.map(contact_event => {
                                    return (
                                        <tr contact_id={contact_event.id} key={contact_event.id} className="contact-row">
                                            <td>{contact_event.contact.name}</td>
                                            <td className="status">
                                                {contact_event.meeting_scheduled ? "Meeting Scheduled" : contact_event.timeslots.length === 0 ? "Invited" : "Availablity Set"}
                                            </td>
                                            <td>
                                                {contact_event.timeslots.length !== 0 && this.state.show_contact == contact_event.id ? <button className="btn btn-primary table-action-button showHideContactAvailibility" onClick={this.hideContactAvailability}>Hide</button> : null}
                                                {contact_event.timeslots.length !== 0 && this.state.show_contact !== contact_event.id ? <button className="btn btn-primary table-action-button showHideContactAvailibility" onClick={() => {this.showContactAvailability({contact_event})}}>Show</button> : null}
                                                {contact_event.timeslots.length === 0 && !contact_event.reminded ? <button className="btn btn-primary table-action-button" onClick={() => {this.sendReminder({contact_event})}}>Remind</button> : null}
                                                {contact_event.timeslots.length === 0 && contact_event.reminded ? <button className="btn btn-primary table-action-button" disabled>Reminded</button> : null}
                                            </td>
                                            <td>
                                                <button className="btn btn-error table-action-button" onClick={() => {this.removeContact({contact_event})}}>Remove</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="divider"></div>
                        <div className="flex pl-4">
                            Deadline:&nbsp;<span id="meetingDeadline">{this.state.event? this.formatDate(this.state.event.deadline) : ""}</span>
                            <input type="datetime-local" id="datePicker" className="display-none"></input>
                        </div>
                        <div className="divider"></div>
                    </div>
                    {/* <div className="main-calendar" id='calendar'></div> */}
                    <FullCalendar
                        // id='calendar'
                    // className="main-calendar"
                    plugins={[ timeGridPlugin, interactionPlugin ]}
                    initialView='timeGridWeek'
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: '',
                    }}
                    allDaySlot={false}
                    selectable={false}
                    editable={true}
                    eventDragStart={this.eventUpdateStart}
                    eventDragStop={this.eventUpdateStop}
                    eventDrop={this.eventUpdateAfter}
                    eventResizeStart={this.eventUpdateStart}
                    eventResizeStop={this.eventUpdateStop}
                    eventResize={this.eventUpdateAfter}
                    eventClick={this.eventClick}
                    scrollTime='08:00:00'
                    initialDate={new Date()}

                    events={this.getCalendarEvents()}
                    ref={this.calendar}
                    />
                </div>
                <div className="divider"></div>
                <div className="action_row">
                    <button className="btn btn-primary" onClick={this.getPossibleMeetingTimes}>Generate Meetings</button>
                    {this.state.proposed_meeting_times.length === 0 ? <button className="btn btn-primary" id="saveAndSendConfirmations" disabled>Save and Send Confirmations</button> : <button className="btn btn-primary" onClick={this.saveAndSendConfirmations} id="saveAndSendConfirmations">Save and Send Confirmations</button>}
                    <button className="btn btn-primary" onClick={this.updateAvailibility}>Update Availability</button>
                    <button className="btn btn-primary" onClick={this.inviteMoreContacts}>Invite More Contacts</button>
                    <button className="btn btn-error" onClick={this.deleteEvent}>Delete Event</button>
                </div>
            </div>
        );
    }
}

export default withRouter(Event);