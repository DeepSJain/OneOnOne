import config from '../../config';
import React from 'react';

import './index.css';

import Reviews from '../../components/reviews/reviews';
import { showAlert } from '../../components/alert_box/alert_box';

import BaseApp from '../../components/base_app/base_app';


class LoginModal extends React.Component {
    submit(event) {
        event.preventDefault();
        
        let username = event.target[0].value;
        let password = event.target[1].value;
    
        fetch(config.API_URL + '/api/token/', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'username': username,
                'password': password
            })
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    localStorage.setItem('token', data.access);
                    
                    showAlert("Login successful", "success");
                    setTimeout(() => window.location.href = `/events/`, 1000);
                });
            } else {
                showAlert("Login failed", "error");
            }
        });
    }

    render() {
        return (
            <dialog id="loginModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h3 className="font-bold text-lg">Login</h3>
                    <form onSubmit={this.submit}>
                        <label className="form-control w-full max-w-xs">

                            <div className="label">
                                <span className="label-text">Username</span>
                            </div>
                            <input type="text" placeholder="Enter username" className="input input-bordered w-full max-w-xs" required></input>


                            <div className="label">
                                <span className="label-text">Password</span>
                            </div>
                            <input type="password" placeholder="Enter password" className="input input-bordered w-full max-w-xs" required></input>


                            <div className="label"></div>
                            <input type="submit" value="Submit" className="w-full max-w-xs btn btn-primary text-white"></input>
                        </label>
                    </form>

                    <div className="label"></div>
                    <form method="dialog">
                        <button className="btn btn-sm btn-ghost" onClick={showRegisterModal}>Don't have an account?</button>
                    </form>

                </div>
            </dialog>
        );
    }
}


class RegisterModal extends React.Component {
    submit(event) {
        event.preventDefault();
    
        let email = event.target[0].value;
        let username = event.target[1].value;
        let password = event.target[2].value;
        
        fetch(config.API_URL + '/api/users/', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'email': email,
                'username': username,
                'password': password
            })
        }).then(response => {
            if (response.status === 201) {
                showAlert("Registration successful", "success");
                showLoginModal();
            } else {
                response.json().then(data => {
                    if (data.username) {
                        showAlert("Username: " + data.username, "error");
                        return;
                    } else if (data.email) {
                        showAlert("Email: " + data.email, "error");
                        return;
                    } else if (data.password) {
                        showAlert("Password: " + data.password, "error");
                        return;
                    }
                    
                    showAlert("Registration failed", "error");
                });
            }
        });
    }

    onChangePassword() {
        let password = document.getElementById("signup-password");
        if (password.value.length < 8) {
            password.setCustomValidity('Password must be at least 8 characters long');
        } else {
            password.setCustomValidity('');
        }
    }
    
    onChangeRepeatPassword() {
        let password = document.getElementById("signup-password");
        let confirm = document.getElementById("signup-confirm-password");
        if (password.value !== confirm.value) {
            confirm.setCustomValidity('Passwords do not match');
        } else {
            confirm.setCustomValidity('');
        }
    }

    render() {
        return (
            <dialog id="RegisterModal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h3 className="font-bold text-lg">Register</h3>
                    <form onSubmit={this.submit}>
                        <label className="form-control w-full max-w-xs">

                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input type="email" placeholder="Enter a valid email" className="input input-bordered w-full max-w-xs" required></input>

                            <div className="label">
                                <span className="label-text">Username</span>
                            </div>
                            <input type="text" placeholder="Enter username" className="input input-bordered w-full max-w-xs" required></input>


                            <div className="label">
                                <span className="label-text">Password</span>
                            </div>
                            <input type="password" placeholder="Enter password" className="input input-bordered w-full max-w-xs" id="signup-password" onChange={this.onChangePassword} required></input>


                            <div className="label">
                                <span className="label-text">Repeat Password</span>
                            </div>
                            <input type="password" placeholder="Enter password" className="input input-bordered w-full max-w-xs" id="signup-confirm-password" onChange={this.onChangeRepeatPassword} required></input>


                            <div className="label"></div>
                            <input type="submit" value="Submit" className="w-full max-w-xs btn btn-primary text-white"></input>
                        </label>
                    </form>

                    <div className="label"></div>
                    <form method="dialog">
                        <button className="btn btn-sm btn-ghost" onClick={showLoginModal}>Already have an account?</button>
                    </form>
                </div>
            </dialog>
        );
    }
}

function Hero() {
    return (
        <div className="hero main">
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="introduction">
                    <h1 className="mb-5 text-5xl font-bold">Scheduling made simple!</h1>
                    <p>In today’s fast-paced world, managing time efficiently has never been more crucial. At 1on1, we understand the value of your time. That's why we've created a revolutionary platform that simplifies the process of scheduling meetings and managing calendars. Whether you're a professional juggling multiple appointments, a business coordinating with clients, or just someone looking to organize your personal schedule more effectively, 1on1 is here to transform the way you plan your time.</p>
                    <br className="hidden lg:block"></br>
                    <p className="hidden lg:block">With our intuitive calendar creation tool, seamless sharing capabilities, and straightforward scheduling system, you’re just a few clicks away from experiencing hassle-free time management. Say goodbye to the endless back-and-forth emails and the confusion of time zone conversions. Welcome to a world where setting up a meeting is as easy as sharing a link.</p>
                    <br className="hidden lg:block"></br>
                    <p className="hidden lg:block">Dive into 1on1 – Your time, your schedule, simplified.</p>
                    <br></br>
                    <button className="btn btn-primary get-started" onClick={showRegisterModal}>Get Started</button>
                </div>
            </div>
        </div>
    );
}

function showRegisterModal() {
    document.getElementById("RegisterModal").showModal();
}

function showLoginModal() {
    document.getElementById("loginModal").showModal();
}

function Main() {
    return (
        <main className="prose p-4">
            <Hero />
            <Reviews />
            <LoginModal />
            <RegisterModal />
        </main>
    );
}

function App() {
    return (
        <BaseApp main={<Main />} home_url="/" is_nav={false} />
    );
}

export default App;
