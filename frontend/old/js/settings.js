function back() {
    history.back();
}

function onChangeProfilePicture() {
    let input = document.getElementById("profile-picture");
    let preview = document.getElementById("profile-picture-preview");
    // let submit = document.getElementById("profile-picture-submit");

    // submit.disabled = true;

    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        preview.src = e.target.result;
        // submit.disabled = false;
    }
    reader.readAsDataURL(file);
}