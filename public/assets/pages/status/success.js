let seconds = 60;
const countdownElement = document.getElementById("countdown");

const countdown = setInterval(() => {
    seconds--;
    countdownElement.innerHTML = `Bạn sẽ được chuyển về trang chủ sau <strong>${seconds}</strong> giây...`;

    if (seconds <= 0) {
        clearInterval(countdown);
        window.location.href = 'http://localhost/CO3049_assignment/public/';
    }
}, 1000);