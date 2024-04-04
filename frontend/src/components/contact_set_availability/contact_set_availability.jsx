import config from '../../config';

import { Component, createRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"

import { showAlert } from '../../components/alert_box/alert_box';

import { get_param } from '../../components/navigation_buttons/navigation_buttons';

import withRouter from '../../components/with_router/with_router';

let id = get_param("id");
let event_id = get_param("event_id");
let authorization = get_param("authorization");

// if (!id || !event_id || !authorization) {
//     showAlert("Invalid URL", "error");
//     window.location.href = "/";
// }

class ContactSetAvailability extends Component {
    constructor(props) {
        super(props);

        this.event_id = 1;

        this.calendar = createRef();

        this.state = {
            eventContact: undefined,
            ownerTimeslots: undefined,
            timeslots: undefined,
        };

        this.getCalendarApi = this.getCalendarApi.bind(this);

        this.setLowPriority = this.setLowPriority.bind(this);
        this.setHighPriority = this.setHighPriority.bind(this);
        this.clearAvailability = this.clearAvailability.bind(this);
        this.select = this.select.bind(this);
        this.unselect = this.unselect.bind(this);
        this.removeAvailabilityOverlaps = this.removeAvailabilityOverlaps.bind(this);
        this.setAvailability = this.setAvailability.bind(this);

        this.addEvent = this.addEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);

        this.getCalendarEvents = this.getCalendarEvents.bind(this);

        this.selectedInfo = undefined;
        this.selected = true;
    }

    getCalendarApi() {
        return this.calendar.current.getApi();
    }

    addEvent(start, end, priority) {
        return new Promise((resolve, reject) => {
            fetch(config.API_URL + `/api/event_contacts/${id}/availability/`, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${btoa(id + ":" + authorization)}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    start_time: start,
                    end_time: end,
                    priority: config.colors.priority_to_int[priority]
                })
            }).then(response => response.json()).then(data => {
                if (data.id) {
                    showAlert("Timeslot added", "success");
                    this.getCalendarApi().addEvent({
                        id: data.id,
                        start: start,
                        end: end,
                        display: 'background',
                        color: config.colors.priority_int_to_color[data.priority]
                    });
                    resolve(data);
                } else {
                    showAlert("Error adding timeslot", "error");
                    // reject("Error adding event");
                }
            });
        });
    }

    deleteEvent(event) {
        return new Promise((resolve, reject) => {
            fetch(config.API_URL + `/api/event_contacts/${id}/availability/${event.id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Basic ${btoa(id + ":" + authorization)}`
                }
            }).then(response => {
                if (response.status === 204) {
                    // showAlert("Timeslot deleted", "success");
                    event.remove();
                    resolve();
                } else {
                    showAlert("Error deleting timeslot", "error");
                    // reject("Error deleting timeslot");
                }
            });
        });
    }

    removeAvailabilityOverlaps(start, end) {
        return new Promise((resolve, reject) => {
            let promises = [];
            let eventHandlingPromises = [];

            let {deleteEvent, addEvent} = this;
    
            this.getCalendarApi().getEvents().forEach(function(event) {
                if (!event.id.startsWith("owner-") && event.display === 'background') {
                    if (start <= event.start && event.end <= end) {
                        promises.push(deleteEvent(event));
                    } else if (event.start < start && end < event.end) {
                        // Instead of pushing to promises inside then(), handle it separately.
                        const handleComplexEventPromise = deleteEvent(event).then(() => {
                            return Promise.all([
                                addEvent(event.start, start, config.colors.color_to_priority[event.backgroundColor]),
                                addEvent(end, event.end, config.colors.color_to_priority[event.backgroundColor])
                            ]);
                        });
                        eventHandlingPromises.push(handleComplexEventPromise);
                    } else if (event.start < end && end < event.end) {
                        const handleEndOverlapPromise = deleteEvent(event).then(() => {
                            return addEvent(end, event.end, config.colors.color_to_priority[event.backgroundColor]);
                        });
                        eventHandlingPromises.push(handleEndOverlapPromise);
                    } else if (event.start < start && start < event.end) {
                        const handleStartOverlapPromise = deleteEvent(event).then(() => {
                            return addEvent(event.start, start, config.colors.color_to_priority[event.backgroundColor]);
                        });
                        eventHandlingPromises.push(handleStartOverlapPromise);
                    }
                }
            });
    
            Promise.all(promises).then(() => {
                return Promise.all(eventHandlingPromises);
            }).then(() => {
                resolve();
            });
        });
    }

    select(info) {
        this.selectedInfo = info;
        this.selected = true;

        let buttons = document.getElementsByClassName('set-availability');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    }

    unselect(info) {
        this.selectedInfo = undefined;
        this.selected = false;

        let buttons = document.getElementsByClassName('set-availability');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }

    setAvailability(start, end, color) {
        let {addEvent} = this;
        this.removeAvailabilityOverlaps(start, end).then(() => {
            addEvent(start, end, config.colors.color_to_priority[color]).then(() => {
                this.getCalendarApi().unselect();
            });
        });
    }

    setLowPriority() {
        this.setAvailability(this.selectedInfo.start, this.selectedInfo.end, config.colors.colors.low);
    }

    setHighPriority() {
        this.setAvailability(this.selectedInfo.start, this.selectedInfo.end, config.colors.colors.high);
    }

    clearAvailability() {
        this.removeAvailabilityOverlaps(this.selectedInfo.start, this.selectedInfo.end).then(() => {
            this.getCalendarApi().unselect();
        });
    }


    componentDidMount() {
        fetch(config.API_URL + `/api/event_contacts/${id}/`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${btoa(id + ":" + authorization)}`
            }
        }).then(response => response.json()).then(data => {
            if (data.id === undefined) {
                showAlert("Error fetching event contact", "error");
                // window.location.href = "/";
                this.props.navigate("/");
            }

            this.setState({eventContact: data});
        });

        const fetchAll = (page=1, all=[]) => {
            fetch(config.API_URL + `/api/event_contacts/${id}/availability/?page=${page}`, {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${btoa(id + ":" + authorization)}`
                }
            }).then(response => response.json()).then(data => {
                let timeslots = data.results;
                if (timeslots === undefined) {
                    showAlert("Error fetching timeslots", "error");
                    // window.location.href = "/";
                    this.props.navigate("/");
                }
                
                all = all.concat(timeslots);
                
                if (data.next) {
                    fetchAll(page+1, all);
                    return;
                }
                
                this.setState({timeslots: all});
            });
        }
        const ownerFetchAll = (page=1, all=[]) => {
            fetch(config.API_URL + `/api/events/${event_id}/availability/?page=${page}`, {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${btoa(id + ":" + authorization)}`
                }
            }).then(response => response.json()).then(data => {
                let timeslots = data.results;
                console.log(timeslots);
                if (timeslots === undefined) {
                    showAlert("Error fetching timeslots", "error");
                    // window.location.href = "/";
                    this.props.navigate("/");
                }
                
                all = all.concat(timeslots);
                
                if (data.next) {
                    ownerFetchAll(page+1, all);
                    return;
                }
                
                this.setState({ownerTimeslots: all});
            });
        }

        fetchAll();
        ownerFetchAll();
    }

    componentDidUpdate() {
        // setTimeout(() => {
        this.unselect();
        // this.getCalendarApi().render();
        // }, 500);

        // this.getCalendarApi().el.classList.add("main-calendar");
    }

    getCalendarEvents() {
        let calendar_events = [];

        this.state.ownerTimeslots.forEach(timeslot => {
            calendar_events.push({
                id: "owner-" + timeslot.id,
                start: timeslot.start_time,
                end: timeslot.end_time,
                display: 'background',
                color: config.colors.priority_int_to_light_color[timeslot.priority]
            });
        });

        this.state.timeslots.forEach(timeslot => {
            calendar_events.push({
                id: timeslot.id,
                start: timeslot.start_time,
                end: timeslot.end_time,
                display: 'background',
                color: config.colors.priority_int_to_color[timeslot.priority]
            });
        });

        if (this.state.eventContact.meeting_scheduled) {
            calendar_events.push({
                id: "meeting",
                title: "Meeting",
                start: this.state.eventContact.meeting_start_time,
                end: this.state.eventContact.meeting_end_time,
                color: config.colors.meeting_color,
                durationEditable: false,
                editable: false
            });
        
        }

        return calendar_events;
    }
    
    render() {
        if (this.state.timeslots === undefined || this.state.ownerTimeslots === undefined || this.state.eventContact === undefined) {
            return;
        }

        return (
            <div className="set-availability">
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
                    selectable={true}
                    editable={true}
                    longPressDelay={250}
                    select={this.select}
                    unselect={this.unselect}
                    unselectAuto={false}
                    scrollTime='08:00:00'
                    initialDate={new Date()}

                    events={this.getCalendarEvents()}
                    ref={this.calendar}
                />
                <div className="action_row">
                    <button className="btn btn-primary set-availability" onClick={this.setLowPriority}>Set Low Priority</button>
                    <button className="btn btn-primary set-availability" onClick={this.setHighPriority}>Set High Priority</button>
                    <button className="btn btn-primary set-availability" onClick={this.clearAvailability}>Clear Availability</button>
                </div>
            </div>
        );
    }
}

export default withRouter(ContactSetAvailability);