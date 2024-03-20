let token = localStorage.getItem("token");
if (!token) {
    showAlert("You must be logged in to view this page", "error");
    window.location.href = "/";
}

let priority_int_to_color = {
    0: '#ffca89',
    1: '#b3ff89'
};

class Events extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        fetch("/api/events/details/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                showAlert("Error fetching events", "error");
                window.location.href = "/";
                return;
            }

            this.setState({events: data.events});
        });
    }

    componentDidUpdate() {
        this.state.events.forEach(event => {
            let calendarEl = document.getElementById(`calendar-${event.id}`);
            let calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: false,
                    center: false,
                    right: false,
                },
                allDaySlot: false,
                selectable: false,
                editable: false,
                longPressDelay: 250,
                unselectAuto: false,
            });
            calendar.render();

            event.time_slots.forEach(timeslot => {
                calendar.addEvent({
                    id: timeslot.id,
                    start: timeslot.start_time,
                    end: timeslot.end_time,
                    display: 'background',
                    color: priority_int_to_color[timeslot.priority]
                });
            });

            event.contacts.forEach(contact => {
                if (contact.meeting_scheduled) {
                    calendar.addEvent({
                        title: contact.name,
                        start: contact.meeting_start_time,
                        end: contact.meeting_end_time,
                        color: '#aa0000'
                    });
                }
            });
        });
    }

    render() {
        return (
            <div className="events">
                {this.state.events.length === 0? <h3 className="text-center">No events found</h3> : null}
                {this.state.events.map(event => {
                    let any_meetings_scheduled = event.contacts.some(contact => contact.meeting_scheduled);
                    let all_meetings_scheduled = event.contacts.every(contact => contact.meeting_scheduled);
                    let passed_deadline = new Date(event.deadline) < new Date();
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

                    return (
                        <div className="event card border rounded-box hover:bg-base-300" onClick={() => window.location.href = `/events/${event.id}/`} key={event.id}>
                            <h3 className="card-title event-center mt-2">{event.name}</h3>
                            <div id={`calendar-${event.id}`} className="home-calendar m-2"></div>
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

function Main() {
    return (
        <main className="prose p-4">            
            <AlertBox />
            <TitleInstructions title="Home" instructions="Click on an event to view more details" />
            <Divider />
            <Events />
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