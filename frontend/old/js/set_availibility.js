let calendarElement;
let calendar;
let selectedInfo;

let colors = {
    'busy': '#ff9f89',
    'low': '#ffca89',
    'high': '#b3ff89'
};

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
            selectable: true,
            editable: true,
            longPressDelay: 250,
            dateClick: dateClick,
            select: select,
            unselect: unselect,
            datesSet: datesSet,
            unselectAuto: false,
            scrollTime: '08:00:00'
        });
    calendar.render();
});

function dateClick(info) {
    // if (info.view.type === 'multiMonthYear') {
    //     info.view.calendar.changeView('dayGridMonth', info.date);
    //     calendar.select(info.date);
    // }

    // if (info.view.type === 'dayGridMonth' && (info.jsEvent.detail === 2 || info.jsEvent.type === 'touchend')) {
    //     info.view.calendar.changeView('timeGridWeek', info.date);
    //     calendar.select(info.date);
    // }
    if (info.view.type === 'multiMonthYear' || info.view.type === 'dayGridMonth') {
        info.view.calendar.changeView('timeGridWeek', info.date);
        // calendar.select(info.date);
    } else {
        let start = info.date;
        let end = new Date(start.getTime() + 1800000);
        info.view.calendar.select(start, end);
    }
}

function select(info) {
    selectedInfo = info;
    let buttons = document.getElementsByClassName('set-availability');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}

function unselect(info) {
    let buttons = document.getElementsByClassName('set-availability');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

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

function removeAvailabilityOverlaps(start, end) {
    calendar.getEvents().forEach(function(event) {
        if (event.id === 'availability') {
            if (start <= event.start && event.end <= end) {
                event.remove();
            } else if (event.start < start && end < event.end) {
                event.remove();
                calendar.addEvent({
                    id: 'availability',
                    start: event.start,
                    end: start,
                    display: 'background',
                    color: event.backgroundColor,
                    allDay: event.allDay
                });
                calendar.addEvent({
                    id: 'availability',
                    start: end,
                    end: event.end,
                    display: 'background',
                    color: event.backgroundColor,
                    allDay: event.allDay
                });
            } else if (event.start < end && end < event.end) {
                event.remove();
                calendar.addEvent({
                    id: 'availability',
                    start: end,
                    end: event.end,
                    display: 'background',
                    color: event.backgroundColor,
                    allDay: event.allDay
                });
            } else if (event.start < start && start < event.end) {
                event.remove();
                calendar.addEvent({
                    id: 'availability',
                    start: event.start,
                    end: start,
                    display: 'background',
                    color: event.backgroundColor,
                    allDay: event.allDay
                });
            }
        }
    });
}

function setAvailability(start, end, color) {
    removeAvailabilityOverlaps(start, end);
    calendar.addEvent({
        id: 'availability',
        start: start,
        end: end,
        display: 'background',
        color: color,
        // allDay: calendar.view.type === 'multiMonthYear' || calendar.view.type === 'dayGridMonth'
    });
    calendar.unselect();
    datesSet();
}

function setBusy() {
    setAvailability(selectedInfo.start, selectedInfo.end, colors.busy);
}

function setLowPriority() {
    setAvailability(selectedInfo.start, selectedInfo.end, colors.low);
}

function setHighPriority() {
    setAvailability(selectedInfo.start, selectedInfo.end, colors.high);
}

function clearAvailability() {
    removeAvailabilityOverlaps(selectedInfo.start, selectedInfo.end);
    calendar.unselect();
    datesSet();
}

function get_param(key) {
    let url = new URL(window.location.href);
    return url.searchParams.get(key);
}

function saveAvailabilityAndgoToInvite() {
    let url = get_param('next');
    if (url == null) {
        url = 'invite_contacts.html';
    }
    window.location.href = url;
}

function back() {
    history.back();
}