let token = localStorage.getItem("token");
if (!token) {
    showAlert("You must be logged in to view this page", "error");
    window.location.href = "/";
}

function Main() {
    React.useEffect(() => {
        document.getElementById("title").innerText = get_param("title");
        document.getElementById("instructions").innerText = get_param("instructions");
    }, []);

    return (
        <main className="prose p-4">                
            <TitleInstructions />
            <Divider />
            <NavigationButtons home={{label: "Go Home", onClick: () => window.location.href = "/events/"}} />
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