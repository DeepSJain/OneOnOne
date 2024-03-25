let token = localStorage.getItem("token");
if (!token) {
    showAlert("You must be logged in to view this page", "error");
    window.location.href = "/";
}

let theme = localStorage.getItem("theme");
localStorage.clear();
localStorage.setItem("theme", theme);
window.location.href = "/";