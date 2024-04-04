import config from '../../config';

import { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"

import { showAlert } from '../../components/alert_box/alert_box';

import withRouter from '../../components/with_router/with_router';

let token = localStorage.getItem("token");

function getRandomColor() {
    let red = Math.floor(Math.random() * 200);
    let green = Math.floor(Math.random() * 200);
    let blue = Math.floor(Math.random() * 200);
    return "#" + red.toString(16) + green.toString(16) + blue.toString(16);
}
  

class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: []
        }

        this.toCalendarEvents = this.toCalendarEvents.bind(this);
        this.eventClick = this.eventClick.bind(this);
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

    toCalendarEvents() {
        let calendar_events = [];

        this.state.events.forEach(event => {
            let color = getRandomColor();
            event.contacts.forEach(contact => {
                if (contact.meeting_scheduled) {
                    calendar_events.push({
                        title: event.name + " - " + contact.name,
                        start: contact.meeting_start_time,
                        end: contact.meeting_end_time,
                        color: color
                    });
                }
            });
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
            <div className="summary">
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
                    editable={false}
                    unselectAuto={false}
                    eventClick={this.eventClick}
                    scrollTime='08:00:00'
                    initialDate={new Date()}

                    events={this.toCalendarEvents()}
                    ref={this.calendar}
                />
            </div>
        );
    }
}

export default withRouter(Summary);