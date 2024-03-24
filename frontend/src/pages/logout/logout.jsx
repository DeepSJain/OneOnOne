function Logout() {
    let theme = localStorage.getItem("theme");
    localStorage.clear();
    localStorage.setItem("theme", theme);
    window.location.href = "/";
}

export default Logout;