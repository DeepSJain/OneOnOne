import config from '../../config';

import { Component } from 'react';

import { showAlert } from '../../components/alert_box/alert_box';

import TitleInstructions from '../../components/title_instructions/title_instructions';
import BaseApp from '../../components/base_app/base_app';

let token = localStorage.getItem("token");

class Settings extends Component {
    constructor(props) {
        super(props);

        this.changePassword = this.changePassword.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this);
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
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
        let new_password_again = event.target[2].value;

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
            <div>
                <div className="collapse collapse-arrow border border-gray-500 bg-base-200">
                    <input type="radio" name="main" />
                    <div className="collapse-title text-xl font-medium"> Account Settings </div>
                    <div className="collapse-content">
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
                            <div className="collapse-title text-m font-medium"> Change Username </div>
                            <div className="collapse-content">
                                <form onSubmit={this.changeUsername} method="post">
                                    <div className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">New Username:</span>
                                            <input type="text" placeholder="Enter New Username" className="input input-bordered w-full max-w-xs" name="new_password_again" required />
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
                <div className="collapse collapse-arrow border border-gray-500 bg-base-200">
                    <input type="radio" name="main" />
                    <div className="collapse-title text-xl font-medium"> Accessibility Settings </div>
                    <div className="collapse-content">
                        <h3 className="mb-4 bg-base-200 mt-4">Text-To-Speach:</h3>
                        <label className="relative inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked />
                            <input type="checkbox" className="toggle toggle-primary" checked />
                        </label>
                        <p>Color Blind Settings:</p>
                        <h3 className="mb-4 bg-base-200 mt-2 text-red-500">See General Settings Below</h3>
                        <h3 className="mb-4 bg-base-200 mt-2">Edit Font Size:</h3>
                        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white" id="fontSize">
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <input id="horizontal-list-radio-small" type="radio" value="" name="font_size" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                    <label for="horizontal-list-radio-small" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Small</label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <input id="horizontal-list-radio-medium" type="radio" value="" name="font_size" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" checked />
                                    <label for="horizontal-list-radio-medium" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Medium</label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <input id="horizontal-list-radio-large" type="radio" value="" name="font_size" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                    <label for="horizontal-list-radio-large" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Large</label>
                                </div>
                            </li>
                            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center ps-3">
                                    <input id="horizontal-list-radio-extra-large" type="radio" value="" name="font_size" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                    <label for="horizontal-list-radio-extra-large" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Extra Large</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

function Main() {
    return (
        <main classNameName="prose p-4">
            <TitleInstructions title="Settings" instructions="Change your account and accessibility settings" />
            <div classNameName="divider"></div>
            <Settings />
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/events/" is_nav={true} />
    );
}

export default App;
