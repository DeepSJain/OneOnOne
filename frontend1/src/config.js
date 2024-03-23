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

const config = {
    API_URL: 'http://localhost:8000',
    colors: {
        colors: colors,
        color_to_priority: color_to_priority,
        priority_to_int: priority_to_int,
        priority_int_to_color: priority_int_to_color
    }
};


export default config;