import config from '../../config';

import { Component } from 'react';

import { showAlert } from '../../components/alert_box/alert_box';

import ThemeSelector from '../../components/theme_selector/theme_selector';

import withRouter from '../with_router/with_router';

let token = localStorage.getItem("token");

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: "",
                email: ""
            }
        }

        this.changePassword = this.changePassword.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this);
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    componentDidMount() {
        fetch(config.API_URL + "/api/users/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            if (data.results.length === 0) {
                showAlert("Error fetching user", "error");
                // window.location.href = "/";
                this.props.navigate("/events/");
                return;
            }

            this.setState({user: data.results[0]});
        });
    }
    

    onChangePassword() {
        let password = document.getElementById("new-password");
        if (password.value.length < 8) {
            password.setCustomValidity('Password must be at least 8 characters long');
        } else {
            password.setCustomValidity('');
        }
    }
    
    onChangeRepeatPassword() {
        let password = document.getElementById("new-password");
        let confirm = document.getElementById("new-confirm-password");
        if (password.value !== confirm.value) {
            confirm.setCustomValidity('Passwords do not match');
        } else {
            confirm.setCustomValidity('');
        }
    }

    changePassword(event) {
        event.preventDefault();

        let old_password = event.target[0].value;
        let new_password = event.target[1].value;
        // let new_password_again = event.target[2].value;

        fetch(config.API_URL + "/api/users/change_password/", {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "old_password": old_password,
                "new_password": new_password
            })
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                if (data.old_password) {
                    showAlert("Old Password: " + data.old_password, "error");
                    return;
                } else if (data.new_password) {
                    showAlert("New Password: " + data.new_password, "error");
                    return;
                } else if (data.detail) {
                    showAlert(data.detail, "error");
                    return;
                }
                
                showAlert("Error changing password", "error");
                return;
            }

            showAlert("Password changed", "success");
            event.target.reset();
        });
    }

    changeUsername(event) {
        event.preventDefault();

        let new_username = event.target[0].value;

        fetch(config.API_URL + "/api/users/change_username/", {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "new_username": new_username
            })
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                if (data.new_username) {
                    showAlert("New Username: " + data.new_username, "error");
                    return;
                } else if (data.detail) {
                    showAlert(data.detail, "error");
                    return;
                }
                
                showAlert("Error changing username", "error");
                return;
            }

            showAlert("Username changed", "success");
            event.target.reset();
            event.target[0].placeholder = new_username;
        });
    }

    changeEmail(event) {
        event.preventDefault();

        let new_email = event.target[0].value;

        fetch(config.API_URL + "/api/users/change_email/", {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "new_email": new_email
            })
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                if (data.new_email) {
                    showAlert("New Email: " + data.new_email, "error");
                    return;
                } else if (data.detail) {
                    showAlert(data.detail, "error");
                    return;
                }

                showAlert("Error changing email", "error");
                return;
            }

            showAlert("Email changed", "success");
            event.target.reset();
            event.target[0].placeholder = new_email;
        });
    }

    showDeleteModal() {
        document.getElementById("DeleteAccount").showModal();
    }

    deleteAccount(event) {
        event.preventDefault();

        let password = event.target[0].value;

        fetch(config.API_URL + "/api/users/delete_account/", {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "password": password
            })
        }).then(response => response.json()).then(data => {
            if (data.status !== "success") {
                if (data.password) {
                    showAlert("Password: " + data.password, "error");
                    return;
                } else if (data.detail) {
                    showAlert(data.detail, "error");
                    return;
                }
                
                showAlert("Error deleting account", "error");
                return;
            }

            showAlert("Account deleted", "success");
            window.location.href = "/logout/";
        });
    }

    render() {
        return (
            <div className="p-4">
                <div className="collapse border border-gray-500 bg-base-200">
                    <input type="radio" name="main" checked />
                    <div className="collapse-title text-xl font-medium"> Account Settings </div>
                    <div className="collapse-content">
                    <div className="collapse collapse-arrow border border-gray-500 bg-base-100">
                            <input type="radio" name="account-settings" />
                            <div className="collapse-title text-m font-medium"> Change Theme </div>
                            <div className="collapse-content">
                                <ThemeSelector selector={true} />
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-gray-500 bg-base-100">
                            <input type="radio" name="account-settings" />
                            <div className="collapse-title text-m font-medium"> Change Username </div>
                            <div className="collapse-content">
                                <form onSubmit={this.changeUsername} method="post">
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">New Username:</span>
                                            <input type="text" placeholder={this.state.user.username} className="input input-bordered w-full max-w-xs" name="new_email" required />
                                        </div>
                                        <div>
                                            <div className="label"></div>
                                            <button className="btn btn-primary">Apply Changes</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-gray-500 bg-base-100">
                            <input type="radio" name="account-settings" />
                            <div className="collapse-title text-m font-medium"> Change Email </div>
                            <div className="collapse-content">
                                <form onSubmit={this.changeEmail} method="post">
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">New Email:</span>
                                            <input type="text" placeholder={this.state.user.email} className="input input-bordered w-full max-w-xs" name="new_username" required />
                                        </div>
                                        <div>
                                            <div className="label"></div>
                                            <button className="btn btn-primary">Apply Changes</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-gray-500 bg-base-100">
                            <input type="radio" name="account-settings" />
                            <div className="collapse-title text-m font-medium"> Change Password </div>
                            <div className="collapse-content">
                                <form onSubmit={this.changePassword} method="post">
                                    <table>
                                        <tr>
                                            <td>
                                                <span className="label-text">Old Password:</span>
                                            </td>
                                            <td>
                                                <input type="password" placeholder="Enter Old Password" className="input input-bordered w-full max-w-xs" name="old_password" required />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="label-text">New Password:</span>
                                            </td>
                                            <td>
                                                <input type="password" placeholder="Enter New Password" className="input input-bordered w-full max-w-xs" name="new_password" id="new-password" onChange={this.onChangePassword} required />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="label-text">Repeat New Password:</span>
                                            </td>
                                            <td>
                                                <input type="password" placeholder="Enter New Password Again" className="input input-bordered w-full max-w-xs" name="new_password_again" id="new-confirm-password" onChange={this.onChangeRepeatPassword} required />
                                            </td>
                                        </tr>
                                    </table>
                                    <label>
                                        <div className="label"></div>
                                        <button className="btn btn-primary">Apply Changes</button>
                                    </label>
                                </form>
                                <p></p>
                            </div>
                        </div>
                        <div className="collapse collapse-arrow border border-gray-500 bg-base-100">
                            <input type="radio" name="account-settings" />
                            <div className="collapse-title text-m font-medium"> Delete Account </div>
                            <div className="collapse-content">
                                <button className="btn mt-4 border-red-500" onClick={this.showDeleteModal}>Delete Account</button>
                                <dialog id="DeleteAccount" className="modal">
                                    <div className="modal-box">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg">ARE YOU SURE YOU WANT TO DELETE THIS ACCOUNT? THIS PROCESS IS NOT REVERSIBLE.</h3>
                                        <form onSubmit={this.deleteAccount} method="post">
                                            <label className="form-control w-full max-w-xs">
                                                <label className="form-control w-full max-w-xs">
                                                    <div className="label">
                                                        <span className="label-text">Enter Password</span>
                                                        <input type="password" placeholder="Enter Password" className="input input-bordered w-full max-w-xs" name="password" required />
                                                    </div>
                                                    <label>
                                                        <div className="label"></div>
                                                        <button className="btn btn-error">DELETE</button>
                                                    </label>
                                                </label>
                                            </label>
                                        </form>
                                    </div>
                                </dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Settings);