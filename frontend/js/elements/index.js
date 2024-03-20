function Reviews() {
    React.useEffect(() => {
        new Swiper('.mySwiper', {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: true
            }
        });
    }, []);

    return (
        <div className="swiper mySwiper">
            <div className="swiper-wrapper">
                <div className="swiper-slide">
                    <div className="review bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img className="w-12 h-12 rounded-full" src="/static/images/profile1.jpg" alt="Profile Picture of Emma"></img>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Emma Johnson</h3>
                                <div className="flex">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm">I've been using this site for my business meetings, and it's incredibly efficient and user-friendly. A must-have tool for professionals!</p>
                    </div>
                </div>
                <div className="swiper-slide">
                    <div className="review bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img className="w-12 h-12 rounded-full" src="/static/images/profile2.jpg" alt="Profile Picture of John"></img>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">John Doe</h3>
                                <div className="flex">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>

                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm">This is the best scheduling tool I've encountered. It's streamlined my appointments and made coordination a breeze!</p>
                    </div>
                </div>
                <div className="swiper-slide">
                    <div className="review bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img className="w-12 h-12 rounded-full" src="/static/images/profile3.jpg" alt="Profile Picture of Sarah"></img>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Sarah Lee</h3>
                                <div className="flex">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.919 1.6-.919 1.902 0l1.286 3.942h4.15c1.002 0 1.418 1.214.707 1.813l-3.365 2.839 1.288 3.95c.301.92-.755 1.684-1.566 1.19l-3.383-2.061-3.383 2.061c-.811.494-1.867-.27-1.566-1.19l1.288-3.95-3.365-2.839c-.711-.599-.295-1.813.707-1.813h4.15l1.286-3.942z"></path></svg>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm">Incredible! This website has simplified my life. The interface is intuitive and makes scheduling hassle-free.</p>
                    </div>
                </div>
            </div>
            <div className="swiper-pagination"></div>
        </div>
    );
}


function LoginModalElement() {
    return (
        <dialog id="loginModal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <h3 className="font-bold text-lg">Login</h3>
                <form onSubmit={loginSubmit}>
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


function RegisterModalElement() {
    return (
        <dialog id="RegisterModal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <h3 className="font-bold text-lg">Register</h3>
                <form onSubmit={registerSubmit}>
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
                        <input type="password" placeholder="Enter password" className="input input-bordered w-full max-w-xs" id="signup-password" onChange={onChangePassword} required></input>


                        <div className="label">
                            <span className="label-text">Repeat Password</span>
                        </div>
                        <input type="password" placeholder="Enter password" className="input input-bordered w-full max-w-xs" id="signup-confirm-password" onChange={onChangeRepeatPassword} required></input>


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

function Index() {
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


function onChangePassword() {
    let password = document.getElementById("signup-password");
    if (password.value.length < 8) {
        password.setCustomValidity('Password must be at least 8 characters long');
    } else {
        password.setCustomValidity('');
    }
}

function onChangeRepeatPassword() {
    let password = document.getElementById("signup-password");
    let confirm = document.getElementById("signup-confirm-password");
    if (password.value != confirm.value) {
        confirm.setCustomValidity('Passwords do not match');
    } else {
        confirm.setCustomValidity('');
    }
}

function loginSubmit(event) {
    event.preventDefault();

    let username = event.target[0].value;
    let password = event.target[1].value;

    fetch('/api/token/', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'username': username,
            'password': password
        })
    }).then(response => {
        if (response.status == 200) {
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

function registerSubmit(event) {
    event.preventDefault();

    let email = event.target[0].value;
    let username = event.target[1].value;
    let password = event.target[2].value;
    
    fetch('/api/users/', {
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
        if (response.status == 201) {
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

function showRegisterModal() {
    RegisterModal.showModal();
}

function showLoginModal() {
    loginModal.showModal();
}

function Main() {
    return (
        <main className="prose p-4">
            <AlertBox />
            <Index />
            <Reviews />
            <LoginModalElement />
            <RegisterModalElement />
        </main>
    );
}

function Page() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle"></input>
            <div className="drawer-content">
                <div className="min-h-screen flex flex-col">
                    <Header home_url="/" />
                    <Main />
                    <Footer />
                </div>
            </div>
        </div>
    );
}