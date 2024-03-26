function back() {
    // if ('referrer' in document && window.location.href !== document.referrer) {
    //     window.location = document.referrer;
    // } else {
    //     window.history.back();
    // }
    window.history.back();
}

// function goHome() {
//     // window.location.href = "/events/";
// }

function get_param(key) {
    let url = new URL(window.location.href);
    return url.searchParams.get(key);
}

function NavigationButtons({back, next, home}) {
    return (
        <div id="navigation_buttons">
            {back ? <button className="btn btn-secondary back-button" onClick={back.onClick}>{back.label}</button> : null}
            {/* {home ? <button className="btn btn-primary center-button" onClick={goHome}>{home.label}</button> : null} */}
            {next ? <button className="btn btn-secondary next-button" onClick={next.onClick}>{next.label}</button> : null}
        </div>
    );
}

export {NavigationButtons, back, get_param};