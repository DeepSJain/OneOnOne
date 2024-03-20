let calendarElement;
let calendar;
let selectedInfo;

let colors = {
    'busy': '#ff9f89',
    'low': '#ffca89',
    'high': '#b3ff89'
};

let now = new Date();
let availibility = [
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0),
        display: 'background',
        color: colors.low,
    },
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 9, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 17, 0),
        display: 'background',
        color: colors.high,
    }
];
let contact1_availability = [
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0),
        display: 'background',
        color: colors.low,
    },
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0),
        display: 'background',
        color: colors.high,
    },
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0),
        display: 'background',
        color: colors.low,
    }
];
let contact2_availability = [
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0),
        display: 'background',
        color: colors.high,
    }
];
let contact3_availability = [
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 9, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 17, 0),
        display: 'background',
        color: colors.high,
    }
];

let contact_meeting_id_to_availability = {
    '1': contact1_availability,
    '2': contact2_availability,
    '3': contact3_availability
};

let contact1_overlap = [
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0),
        display: 'background',
        color: colors.busy
    },
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0),
        display: 'background',
        color: colors.low,
    },
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0),
        display: 'background',
        color: colors.low,
    }
];
let contact2_overlap = [
    {
        id: 'availability',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0),
        display: 'background',
        color: colors.low,
    }
];
let contact3_overlap = [];

let contact_meeting_id_to_overlap = {
    '1': contact1_overlap,
    '2': contact2_overlap,
    '3': contact3_overlap
};

// let meetings = [
//     {
//         title: 'John Doe',
//         id: 'meeting_1',
//         start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0),
//         end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 12, 0)
//     },
//     {
//         title: 'Jane Doe',
//         id: 'meeting_2',
//         start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
//         end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0)
//     }
// ];

function generatePossibleMeetings() {
    let random1 = Math.floor(Math.random() * 5) / 2;
    let random2 = Math.floor(Math.random() * 3) / 2;
    return [
        {
            title: 'John Doe',
            id: 'meeting_1',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11 + random1, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 12 + random1, 0)
        },
        {
            title: 'Jane Doe',
            id: 'meeting_2',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13 + random2, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14 + random2, 0)
        }
    ];
}

let meeting_contact_ids = ['1', '2'];


function datesSet(info) {
    calendar.getEvents().forEach(function(event) {
        if (event.id === 'month_availability') {
            event.remove();
        }
    });

    if (calendar.view.type === 'multiMonthYear' || calendar.view.type === 'dayGridMonth') {
        // Add all-day events to show availability
        let availability_dates = {};
        calendar.getEvents().forEach(function(event) {
            if (event.id === 'availability') {
                // for each day in the event, add an event to dates
                let date = event.start;
                while (date < event.end) {
                    let date_only = date.toISOString().split('T')[0] + 'T00:00:00';
                    if (availability_dates[date_only] === undefined) {
                        availability_dates[date_only] = {
                            [colors.busy]: 0,
                            [colors.low]: 0,
                            [colors.high]: 0
                        };
                    }
                    
                    let start = new Date(date_only);
                    let end = new Date(start.getTime() + 86400000);
                    if (event.start > start) {
                        start = event.start;
                    }
                    if (event.end < end) {
                        end = event.end;
                    }
                    availability_dates[date_only][event.backgroundColor] += end - start;

                    date = new Date(date.getTime() + 86400000);
                }
            }
        });

        for (let date in availability_dates) {
            let color;
            if (availability_dates[date][colors.high] > 0) {
                color = colors.high;
            } else if (availability_dates[date][colors.low] > 0) {
                color = colors.low;
            } else if (availability_dates[date][colors.busy] == 86400000) {
                color = colors.busy;
            } else {
                continue;
            }
            calendar.addEvent({
                id: 'month_availability',
                start: date,
                end: new Date(new Date(date).getTime() + 86400000),
                display: 'background',
                color: color,
                allDay: true
            });
        }
    }
}

let before_drag_events;
function eventUpdateStart(info) {
    if (!info.event.id.startsWith('meeting_')) {
        return;
    }

    let meeting_id = info.event.id.split("_")[1];

    before_drag_events = calendar.getEvents();

    calendar.getEvents().forEach(function(event) {
        if (event.id == 'availability' || event.id == 'month_availability') {
            event.remove();
        }
    });

    let contact_overlap = contact_meeting_id_to_overlap[meeting_id];
    
    contact_overlap.forEach(function(event) {
        calendar.addEvent(event);
    });

    datesSet();
}

function eventUpdateStop(info) {
    if (!info.event.id.startsWith('meeting_')) {
        return;
    }

    let meeting_id = info.event.id.split("_")[1];

    calendar.getEvents().forEach(function(event) {
        if (event.id == 'availability' || event.id == 'month_availability') {
            event.remove();
        }
    });

    // let contact_overlap = contact_meeting_id_to_overlap[meeting_id];
    
    // let allowed_position = false;
    // contact_overlap.forEach(function(event){
    //     if (event.start <= info.event.start && info.event.end <= event.end) {
    //         allowed_position = true;
    //     }
    // });

    // let moved = false;

    before_drag_events.forEach(function(event) {
        if (event.id == 'availability' || event.id == 'month_availability') {
            calendar.addEvent(event);
        }

        // if (event.id == info.event.id && (event.start != info.event.start || event.end != info.event.end)) {
        //     moved = true;
        // }
    });

    datesSet();

    // if (moved) {
    document.getElementById("saveAndSendConfirmations").disabled = false;
    // }
}

function dateClick(info) {
    if (info.view.type === 'multiMonthYear' || info.view.type === 'dayGridMonth') {
        info.view.calendar.changeView('timeGridWeek', info.date);
        // calendar.select(info.date);
    } else {
        let start = info.date;
        let end = new Date(start.getTime() + 1800000);
        info.view.calendar.select(start, end);
    }

    calendar.unselect();
}


document.addEventListener('DOMContentLoaded', function() {
    calendarElement = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarElement, {
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek',
            },
            allDaySlot: false,
            selectable: false,
            editable: true,
            longPressDelay: 250,
            dateClick: dateClick,
            // select: select,
            // unselect: unselect,
            eventDragStart: eventUpdateStart,
            eventDragStop: eventUpdateStop,
            eventResizeStart: eventUpdateStart,
            eventResizeStop: eventUpdateStop,
            datesSet: datesSet,
            unselectAuto: false,
        });

    availibility.forEach(function(event) {
        calendar.addEvent(event);
    });
    
    calendar.render();


    let meetingDeadline = document.getElementById('meetingDeadline');
    let datePicker = document.getElementById('datePicker');

    datePicker.value = meetingDeadline.textContent.replace(' ', 'T');

    meetingDeadline.addEventListener('click', function() {
        datePicker.style.display = 'block';
        meetingDeadline.style.display = 'none';
        datePicker.focus();
    });

    datePicker.addEventListener('change', function() {
        meetingDeadline.textContent = this.value.replace('T', ' ');
        // this.style.display = 'none';
    });

    datePicker.addEventListener('blur', function() {
        this.style.display = 'none';
        meetingDeadline.style.display = 'block';
    });
});

function updateAvailibility() {
    let url = new URL(window.location.href);
    window.location.href = "set_availibility.html?next=" + encodeURI("event.html" + url.search);
}

function inviteMoreContacts() {
    let url = new URL(window.location.href);
    window.location.href = "invite_contacts.html?next=" + encodeURI("event.html" + url.search);
}

function deleteEvent() {
    window.location.href = "confirmation.html?title=" + encodeURI("Succesfully Deleted Event") + "&instructions=" + encodeURI("This event has been deleted");
}

function remindContact(button) {
    button.parentElement.parentElement.children[1].innerHTML = "Reminded";
    button.disabled = true;
}

function removeContact(button) {
    button.parentElement.parentElement.remove();
}

function showContactAvailability(button) {
    let contact_id = button.parentElement.parentElement.getAttribute("contact_id");

    Array.from(document.getElementsByClassName("showHideContactAvailibility")).forEach(function(b){
        b.innerHTML = "Show";
        b.onclick = function(){showContactAvailability(b);};
    });

    button.innerHTML = "Hide";
    button.onclick = function(){hideContactAvailability(button);};

    calendar.getEvents().forEach(function(event) {
        if (event.id == 'availability' || event.id == 'month_availability') {
            event.remove();
        }
    });
    
    let contact_availability = contact_meeting_id_to_availability[contact_id];
    
    contact_availability.forEach(function(event) {
        calendar.addEvent(event);
    });

    datesSet();
}

function hideContactAvailability(button) {
    Array.from(document.getElementsByClassName("showHideContactAvailibility")).forEach(function(b){
        b.innerHTML = "Show";
        b.onclick = function(){showContactAvailability(b);};
    });

    button.innerHTML = "Show";
    button.onclick = function(){showContactAvailability(button);};
    
    calendar.getEvents().forEach(function(event) {
        if (event.id == 'availability' || event.id == 'month_availability') {
            event.remove();
        }
    });
    
    availibility.forEach(function(event) {
        calendar.addEvent(event);
    });

    datesSet();
}

function generateMeetings() {
    calendar.getEvents().forEach(function(event) {
        if (event.id.startsWith('meeting_')) {
            event.remove();
        }
    });

    let meetings = generatePossibleMeetings();

    meetings.forEach(function(event) {
        calendar.addEvent(event);
    });

    datesSet();

    document.getElementById("saveAndSendConfirmations").disabled = false;
}

function saveAndSendConfirmations() {
    Array.from(document.getElementsByClassName("status")).forEach(function(status){
        let contact_id = status.parentElement.getAttribute("contact_id");
        if (meeting_contact_ids.includes(contact_id)) {
            status.innerHTML = "Confirmation Sent";
        }
        // else if (status.innerHTML == "Availability Set") {
        //     status.innerHTML = "Unable to Assign Meeting";
        // }
    });

    document.getElementById("saveAndSendConfirmations").disabled = true;
}


function back() {
    // history.back();
    window.location.href = "home.html";
}