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


document.addEventListener('DOMContentLoaded', function() {
    let mySwiper = new Swiper('.mySwiper', {
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
});