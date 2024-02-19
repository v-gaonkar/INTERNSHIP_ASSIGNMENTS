const Form = document.getElementById('form-input');
const countdownInput = document.getElementById('countdown-input');
const start= document.getElementById('start');
const countdown = document.querySelector('.countdown');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');

let countdownTimer;
let remainingTime;

Form.addEventListener('submit', function(event) {
    event.preventDefault();
    startCountdown();
});

function startCountdown() {
    const inputVal = countdownInput.value.trim();

    if (!/^\d+$/.test(inputVal)) {
        alert('Please enter a valid countdown time (positive number)');
        return;
    }

    remainingTime = parseInt(inputVal);
    if (remainingTime <= 0 || remainingTime > 10000) {
        alert('Please enter a value between 1 and 10000');
        return;
    }

    countdownInput.disabled = true;
    start.disabled = true;
    countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    remainingTime--;

    if (remainingTime <= 0) {
        clearInterval(countdownTimer);
        countdown.textContent = '00:00:00';
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        countdownInput.disabled = false;
        start.disabled = false;
        return;
    }
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const progress = Math.round(((countdownInput.value - remainingTime) / countdownInput.value) * 100);
    progressText.textContent = `${progress}%`;
    if (remainingTime % 5 === 0) {
        progressFill.style.width = `${progress}%`;
    }
}
