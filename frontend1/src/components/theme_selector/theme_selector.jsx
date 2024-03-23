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
        themeSelect();

        if (!token) {
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

            document.querySelector("[data-choose-theme]").value = data.theme;
            themeSelect();
        });
    }

    saveTheme() {
        let theme = document.querySelector("[data-choose-theme]").value;

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
        if (!this.selector) {
            return (
                <input type="hidden" data-choose-theme value="dark"></input>
            );
        }
        return (
            <select data-choose-theme className="select select-bordered w-full max-w-xs" onChange={this.saveTheme}>
                <option value="dark">dark</option>
                <option value="light">light</option>
                <option value="cupcake">cupcake</option>
                <option value="bumblebee">bumblebee</option>
                <option value="emerald">emerald</option>
                <option value="corporate">corporate</option>
                <option value="synthwave">synthwave</option>
                <option value="retro">retro</option>
                <option value="cyberpunk">cyberpunk</option>
                <option value="valentine">valentine</option>
                <option value="halloween">halloween</option>
                <option value="garden">garden</option>
                <option value="forest">forest</option>
                <option value="aqua">aqua</option>
                <option value="lofi">lofi</option>
                <option value="pastel">pastel</option>
                <option value="fantasy">fantasy</option>
                <option value="wireframe">wireframe</option>
                <option value="black">black</option>
                <option value="luxury">luxury</option>
                <option value="dracula">dracula</option>
                <option value="cmyk">cmyk</option>
                <option value="autumn">autumn</option>
                <option value="business">business</option>
                <option value="acid">acid</option>
                <option value="lemonade">lemonade</option>
                <option value="night">night</option>
                <option value="coffee">coffee</option>
                <option value="winter">winter</option>
                <option value="dim">dim</option>
                <option value="nord">nord</option>
                <option value="sunset">sunset</option>
            </select>
        );
    }
}

export default ThemeSelector;