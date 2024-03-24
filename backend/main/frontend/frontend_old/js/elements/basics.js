function ThemeSelector() {
    React.useEffect(() => {
        themeSelect();
    }, []);

    return (
        <select data-choose-theme className="select select-bordered w-full max-w-xs">
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

function Header({home_url="/events/"}) {
    return (
        <header className="navbar bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] shadow-sm">
            <div className="flex-none">
                <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost drawer-button lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <div className="flex-1">
                <a href={home_url} className="btn btn-ghost text-xl"><img src="/static/images/logo.png" className="logo"></img></a>
            </div>
            <div className="flex-none">
                <ThemeSelector selector={false} />
            </div>
        </header>
    );
}


function Footer() {
    return (
      <footer className="footer mt-auto footer-center p-4 bg-base-300 text-base-content self-end">
          <aside>
              <p>Copyright 2024 - All right reserved by 1on1</p>
          </aside>
      </footer>
    );
  }


//   function Nav() {
//     return (
//         <nav className="drawer-side z-40">
//             <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
//             <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content flex-col flex">
//                 <li><a href="/events/">Home</a></li>
//                 <li><a href="/contacts/">Contacts</a></li>
//                 <li><a href="/create_event/">Create Event</a></li>
//                 <div tabIndex="0" className="collapse collapse-open">
//                     <div className="pt-2 pb-2 pl-4 h-auto">Your Events</div>
//                     <div className="collapse-content"> 
//                         <li><a href="event.html?event_id=1">Event 1 Name</a></li>
//                         <li><a href="event.html?event_id=2">Event 2 Name</a></li>
//                     </div>
//                 </div>
//                 <li className="grow bg-base-200"></li>
//                 <li><a href="/settings/">Settings</a></li>
//                 <li><a href="/logout/">Logout</a></li>
//             </ul>
//         </nav>
//     );
// }

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        const fetchAll = (page=1, all=[]) => {
            fetch("/api/events/?page=" + page, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()).then(data => {
                let events = data.results;
                if (events === undefined) {
                    showAlert("Error fetching events", "error");
                    window.location.href = "/";
                }
                
                all = all.concat(events);
                
                if (data.next) {
                    fetchAll(page+1, all);
                    return;
                }
                
                this.setState({events: all});
            });
        }

        fetchAll();
    }

    render() {
        return (
            <nav className="drawer-side z-40">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content flex-col flex">
                    <li><a className={window.location.pathname.split("?")[0] == "/events/" ? "bg-base-300" : ""} href="/events/">Home</a></li>
                    <li><a className={window.location.pathname.startsWith("/contacts/") ? "bg-base-300" : ""} href="/contacts/">Contacts</a></li>
                    <li><a className={window.location.pathname.startsWith("/create_event/") ? "bg-base-300" : ""} href="/create_event/">Create Event</a></li>
                    <div tabIndex="0" className="collapse collapse-open">
                        <div className="pt-2 pb-2 pl-4 h-auto">Your Events</div>
                        <div className="collapse-content"> 
                            {this.state.events.map(event => {
                                return (
                                    <li key={event.id}>
                                        <a className={window.location.pathname.startsWith(`/events/${event.id}/`) ? "bg-base-300" : ""} href={`/events/${event.id}/`}>{event.name}</a>
                                    </li>
                                )
                            })}
                        </div>
                    </div>
                    <li className="grow bg-base-200"></li>
                    <li><a className={window.location.pathname.startsWith("/settings/") ? "bg-base-300" : ""} href="/settings/">Settings</a></li>
                    <li><a className={window.location.pathname.startsWith("/logout/") ? "bg-base-300" : ""} href="/logout/">Logout</a></li>
                </ul>
            </nav>
        );
    }
}


function TitleInstructions({title="", instructions=""}) {
    return (
        <div className="title-instructions">
            <h1 id="title" className="font-bold">{title}</h1>
            <p id="instructions" className="text-gray-500">{instructions}</p>
        </div>
    );
}

function Divider() {
    return (
        <div className="divider"></div>
    );
}

function goHome() {
    window.location.href = "/events/";
}

function NavigationButtons({back, next, home}) {
    return (
        <div id="navigation_buttons">
            {back ? <button className="btn btn-secondary back-button" onClick={back.onClick}>{back.label}</button> : null}
            {home ? <button className="btn btn-primary center-button" onClick={goHome}>{home.label}</button> : null}
            {next ? <button className="btn btn-secondary next-button" onClick={next.onClick}>{next.label}</button> : null}
        </div>
    );
}

function AlertBox() {
    React.useEffect(() => {
        document.getElementById("alert_box").style.display = "none";
    }, []);

    return (
        <div id="alert_box" className={`alert alert-dismissible fixed right-4 top-4 z-50 w-96 z-50`} role="alert">
            <div className="flex-1">
                <label className="label"></label>
            </div>
        </div>
    );
}

function showAlert(message, type, timeout=5000) {
    try {
        document.getElementById("alert_box").classList.remove("alert-success", "alert-error", "alert-warning", "alert-info");
        document.getElementById("alert_box").classList.add(`alert-${type}`);
        document.getElementById("alert_box").innerText = message;
        
        document.getElementById("alert_box").style.display = "block";
        
        setTimeout(() => {
            document.getElementById("alert_box").style.display = "none";
        }, timeout);
    } catch (e) {
        console.log(e);
    
    }
}

function get_param(key) {
    let url = new URL(window.location.href);
    return url.searchParams.get(key);
}

function back() {
    if ('referrer' in document && window.location.href !== document.referrer) {
        window.location = document.referrer;
    } else {
        window.history.back();
    }
}

function formatDate(date) {
    return date.split("T")[0] + " " + date.split("T")[1].split("Z")[0];
}