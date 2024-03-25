import config from '../../config';

import { themeSelect } from './theme-change';
import { Component } from 'react';

import { showAlert } from '../alert_box/alert_box';

let token = localStorage.getItem("token");

class ThemeSelector extends Component {
    constructor(props) {
        super(props);

        this.selector = props.selector;

        this.saveTheme = this.saveTheme.bind(this);
    }

    componentDidMount() {
        if (!token) {
            return;
        }

        themeSelect();

        if (this.selector) {
            return;
        }

        fetch(config.API_URL + "/api/users/get_theme/", {
            "method": "GET",
            "headers": {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                showAlert("Error fetching theme", "error");
                return;
            }

            // document.querySelector("[data-choose-theme]").value = data.theme;
            if (localStorage.getItem("theme") !== data.theme) {
                localStorage.setItem("theme", data.theme);
                themeSelect();
            }
        });
    }

    saveTheme() {
        let theme = document.getElementById("theme-change-selector").value;

        fetch(config.API_URL + "/api/users/change_theme/", {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "theme": theme
            })
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                showAlert("Error saving theme", "error");
                return;
            }

            showAlert("Theme saved", "success");
        });
    }

    render() {
        if (!token || !this.selector) {
            return (
                <input type="hidden" data-choose-theme value="dark"></input>
            );
        }

        return (
            <select id="theme-change-selector" data-choose-theme className="select select-bordered w-full max-w-xs" onChange={this.saveTheme}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="cupcake">Cupcake</option>
                <option value="bumblebee">Bumblebee</option>
                <option value="emerald">Emerald</option>
                <option value="corporate">Corporate</option>
                <option value="synthwave">Synthwave</option>
                <option value="retro">Retro</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="valentine">Valentine</option>
                <option value="halloween">Halloween</option>
                <option value="garden">Garden</option>
                <option value="forest">Forest</option>
                <option value="aqua">Aqua</option>
                <option value="lofi">Lofi</option>
                <option value="pastel">Pastel</option>
                <option value="fantasy">Fantasy</option>
                <option value="wireframe">Wireframe</option>
                <option value="black">Black</option>
                <option value="luxury">Luxury</option>
                <option value="dracula">Dracula</option>
                <option value="cmyk">Cmyk</option>
                <option value="autumn">Autumn</option>
                <option value="business">Business</option>
                <option value="acid">Acid</option>
                <option value="lemonade">Lemonade</option>
                <option value="night">Night</option>
                <option value="coffee">Coffee</option>
                <option value="winter">Winter</option>
                <option value="dim">Dim</option>
                <option value="nord">Nord</option>
                <option value="sunset">Sunset</option>
            </select>
        );
    }
}

export default ThemeSelector;