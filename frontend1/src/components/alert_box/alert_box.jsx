import { Component } from 'react';

class AlertBox extends Component {
    render() {
        return (
            <div id="alert_box" className={`alert alert-dismissible fixed right-4 top-4 z-50 w-96 z-50`} role="alert" hidden>
                <div className="flex-1">
                    <label className="label"></label>
                </div>
            </div>
        );
    }
}

function showAlert(message, type, timeout=5000) {
    try {
        document.getElementById("alert_box").classList.remove("alert-success", "alert-error", "alert-warning", "alert-info");
        document.getElementById("alert_box").classList.add(`alert-${type}`);
        document.getElementById("alert_box").innerText = message;
        
        document.getElementById("alert_box").style.display = "block";
        document.getElementById("alert_box").hidden = false;
        
        setTimeout(() => {
            document.getElementById("alert_box").style.display = "none";
            document.getElementById("alert_box").hidden = true;
        }, timeout);
    } catch (e) {
        console.log(e);
    
    }
}

export { AlertBox, showAlert };