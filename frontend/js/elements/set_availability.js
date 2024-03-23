// TODO: join same priority events

let token = localStorage.getItem("token");
if (!token) {
    showAlert("You must be logged in to view this page", "error");
    window.location.href = "/";
}


let calendar;

let colors = {
    'low': '#ffca89',
    'high': '#b3ff89'
};
let color_to_priority = {
    '#ffca89': 'low',
    '#b3ff89': 'high'
};
let priority_to_int = {
    'low': 0,
    'high': 1
};
let priority_int_to_color = {
    0: '#ffca89',
    1: '#b3ff89'
};

function deleteEvent(event) {
    return new Promise((resolve, reject) => {
        fetch(`/api/events/${url_params.event_id}/availability/${event.id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 204) {
                // showAlert("Event deleted", "success");
                event.remove();
                resolve();
            } else {
                showAlert("Error deleting event", "error");
                reject();
            }
        });
    });
}

function addEvent(start, end, priority) {
    return new Promise((resolve, reject) => {
        fetch(`/api/events/${url_params.event_id}/availability/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                start_time: start,
                end_time: end,
                priority: priority_to_int[priority]
            })
        }).then(response => response.json()).then(data => {
            if (data.id) {
                // showAlert("Event added", "success");
                calendar.addEvent({
                    id: data.id,
                    start: start,
                    end: end,
                    display: 'background',
                    color: priority_int_to_color[data.priority]
                });
                resolve(data);
            } else {
                showAlert("Error adding event", "error");
                reject(data);
            }
        });
    });
}

class SetAvailability extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeslots: []
        };
        this.setLowPriority = this.setLowPriority.bind(this);
        this.setHighPriority = this.setHighPriority.bind(this);
        this.clearAvailability = this.clearAvailability.bind(this);
        this.select = this.select.bind(this);
        this.unselect = this.unselect.bind(this);
        this.removeAvailabilityOverlaps = this.removeAvailabilityOverlaps.bind(this);
        this.setAvailability = this.setAvailability.bind(this);

        this.selectedInfo = undefined;
        this.selected = true;
    }

    removeAvailabilityOverlaps(start, end) {
        return new Promise((resolve, reject) => {
            let promises = [];
            let eventHandlingPromises = [];
    
            calendar.getEvents().forEach(function(event) {
                if (start <= event.start && event.end <= end) {
                    promises.push(deleteEvent(event));
                } else if (event.start < start && end < event.end) {
                    // Instead of pushing to promises inside then(), handle it separately.
                    const handleComplexEventPromise = deleteEvent(event).then(() => {
                        return Promise.all([
                            addEvent(event.start, start, color_to_priority[event.backgroundColor]),
                            addEvent(end, event.end, color_to_priority[event.backgroundColor])
                        ]);
                    });
                    eventHandlingPromises.push(handleComplexEventPromise);
                } else if (event.start < end && end < event.end) {
                    const handleEndOverlapPromise = deleteEvent(event).then(() => {
                        return addEvent(end, event.end, color_to_priority[event.backgroundColor]);
                    });
                    eventHandlingPromises.push(handleEndOverlapPromise);
                } else if (event.start < start && start < event.end) {
                    const handleStartOverlapPromise = deleteEvent(event).then(() => {
                        return addEvent(event.start, start, color_to_priority[event.backgroundColor]);
                    });
                    eventHandlingPromises.push(handleStartOverlapPromise);
                }
            });
    
            Promise.all(promises).then(() => {
                return Promise.all(eventHandlingPromises);
            }).then(() => {
                resolve();
            }).catch(reject);
        });
    }

    setAvailability(start, end, color) {
        this.removeAvailabilityOverlaps(start, end).then(() => {
            addEvent(start, end, color_to_priority[color]).then(() => {
                calendar.unselect();
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

    setLowPriority() {
        this.setAvailability(this.selectedInfo.start, this.selectedInfo.end, colors.low);
    }

    setHighPriority() {
        this.setAvailability(this.selectedInfo.start, this.selectedInfo.end, colors.high);
    }

    clearAvailability() {
        this.removeAvailabilityOverlaps(this.selectedInfo.start, this.selectedInfo.end).then(() => {
            calendar.unselect();
        });
    }


    componentDidMount() {
        const fetchAll = (page=1, all=[]) => {
            fetch(`/api/events/${url_params.event_id}/availability/?page=${page}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => {
                let timeslots = data.results;
                if (timeslots === undefined) {
                    showAlert("Error fetching timeslots", "error");
                    window.location.href = "/";
                }
                
                all = all.concat(timeslots);
                
                if (data.next) {
                    fetchAll(page+1, all);
                    return;
                }
                
                this.setState({timeslots: all});
            });
        }

        fetchAll();
    }

    componentDidUpdate() {
        this.unselect();

        calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: '',
                },
                allDaySlot: false,
                selectable: true,
                editable: true,
                longPressDelay: 250,
                select: this.select,
                unselect: this.unselect,
                unselectAuto: false,
                scrollTime: '08:00:00'
            });
        calendar.render();

        this.state.timeslots.forEach(timeslot => {
            calendar.addEvent({
                id: timeslot.id,
                start: timeslot.start_time,
                end: timeslot.end_time,
                display: 'background',
                color: priority_int_to_color[timeslot.priority]
            });
        });
    }
    
    render() {
        return (
            <div>
                <div className="main-calendar" id='calendar'></div>
                <div className="action_row">
                    <button className="btn btn-primary set-availability" onClick={this.setLowPriority} disabled={!this.selected}>Set Low Priority</button>
                    <button className="btn btn-primary set-availability" onClick={this.setHighPriority} disabled={!this.selected}>Set High Priority</button>
                    <button className="btn btn-primary set-availability" onClick={this.clearAvailability} disabled={!this.selected}>Clear Availability</button>
                </div>
            </div>
        );
    }
}

function Main() {
    return (
        <main className="prose p-4">            
            <AlertBox />
            <TitleInstructions title="Set Your Availability" instructions="Select a time slot and click one of the buttons below to set your availability." />
            <Divider />
            <SetAvailability />
            <Divider />
            {get_param("next") !== null ? <NavigationButtons back={{label: "Back", onClick: back}} next={{label: "Next", onClick: () => window.location.href = get_param("next")}} /> : <NavigationButtons back={{label: "Back", onClick: back}} />}
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