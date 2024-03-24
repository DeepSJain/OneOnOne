let token = localStorage.getItem("token");
if (!token) {
    showAlert("You must be logged in to view this page", "error");
    window.location.href = "/";
}

function next() {
    document.getElementById("submit-create-form").click();
    // createEvent(new Event("submit"));
}

function createEvent(event) {
    event.preventDefault();

    let name = document.getElementById("event_name").value;
    let deadline = document.getElementById("event_deadline").value;

    fetch("/api/events/", {
        "method": "POST",
        "headers": {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "name": name,
            "deadline": deadline
        })
    }).then(response => response.json()).then(data => {
        if (data.id === undefined) {
            if (data.name) {
                showAlert("Name: " + data.name, "error");
                return;
            } else if (data.deadline) {
                showAlert("Deadline: " + data.deadline, "error");
                return;
            } else if (data.detail) {
                showAlert(data.detail, "error");
                return;
            }
            
            showAlert("Error creating event", "error");
            return;
        }

        showAlert("Event created", "success");
        setTimeout(() => window.location.href = `/events/${data.id}/set_availability/?next=/events/${data.id}/invite_contacts/%3Fnext=/events/${data.id}/`, 1000);
    });
}

function CreateEvent() {
    return (
        <div className="action_row">
        <form onSubmit={createEvent} id="create-form">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="event_name">Event Name:</label>
                        </td>
                        <td>
                            <input type="text" id="event_name" name="event_name" className="m-2 input input-bordered w-full" placeholder="Event Name" required></input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_deadline">Event Deadline:</label>
                        </td>
                        <td>
                            <input type="datetime-local" id="event_deadline" name="event_deadline" className="m-2 input input-bordered w-full" required></input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="submit" id="submit-create-form" hidden>Submit</button>
        </form>
    </div>
    );
}

function Main() {
    return (
        <main className="prose p-4">            
            <AlertBox />
            <TitleInstructions title="Create Event" instructions="Enter the event name and deadline." />
            <Divider />
            <CreateEvent />
            <Divider />
            <NavigationButtons back={{label: "Back", onClick: back}} next={{label: "Next", onClick: next}} />
        </main>
    );
}

function Page() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle"></input>
            <div className="drawer-content">
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <Main />
                    <Footer />
                </div>
            </div>
            <Nav />
        </div>
    );
}