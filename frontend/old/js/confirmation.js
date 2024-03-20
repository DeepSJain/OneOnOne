function goHome() {
    window.location.href = "home.html";
}

function get_param(key) {
    let url = new URL(window.location.href);
    return url.searchParams.get(key);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("title").innerText = get_param("title");
    document.getElementById("instructions").innerText = get_param("instructions");
});