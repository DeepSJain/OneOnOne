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
let priority_int_to_light_color = {
    0: 'darkgray',
    1: 'lightgray'
};

const config = {
    API_URL: 'http://localhost:8000',
    colors: {
        colors: colors,
        color_to_priority: color_to_priority,
        priority_to_int: priority_to_int,
        priority_int_to_color: priority_int_to_color,
        priority_int_to_light_color: priority_int_to_light_color,
        meeting_color: '#aa0000'
    }
};


export default config;