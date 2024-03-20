let colors = {
    'busy': '#ff9f89',
    'low': '#ffca89',
    'high': '#b3ff89'
};

let now = new Date();

document.addEventListener('DOMContentLoaded', function() {
    let calendar1Element = document.getElementById('calendar1');
    calendar1 = new FullCalendar.Calendar(calendar1Element, {
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
            scrollTime: '08:00:00'
        });

        calendar1.addEvent({
            title: 'John Doe',
            id: 'meeting_1',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 12, 0)
        });
        calendar1.addEvent({
            title: 'Jane Doe',
            id: 'meeting_2',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0)
        });
    calendar1.render();

    let calendar2Element = document.getElementById('calendar2');
    calendar2 = new FullCalendar.Calendar(calendar2Element, {
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
            scrollTime: '08:00:00'
        });

        calendar2.addEvent({
            id: 'availability',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0),
            display: 'background',
            color: colors.low,
        });
        calendar2.addEvent({
            id: 'availability',
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 9, 0),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 17, 0),
            display: 'background',
            color: colors.high,
        });

    calendar2.render();

    // let calendar3Element = document.getElementById('calendar3');
    // calendar3 = new FullCalendar.Calendar(calendar3Element, {
    //         initialView: 'timeGridWeek',
    //         headerToolbar: {
    //             left: false,
    //             center: false,
    //             right: false,
    //         },
    //         allDaySlot: false,
    //         selectable: false,
    //         editable: false,
    //         longPressDelay: 250,
    //         unselectAuto: false,
    //     });
    // calendar3.render();
});

function viewEvent(event_id) {
    window.location.href = "event.html?event_id=" + event_id;
}