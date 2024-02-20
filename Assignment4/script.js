const Form = document.getElementById('form-input');
const countdownInput = document.getElementById('countdown-input');
const start = document.getElementById('start');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');

let countdownTimer;
let totalSeconds;
let remainingTime;
let count = 0;

Form.addEventListener('submit', function(event) {
    event.preventDefault();
    startCountdown();
});

function startCountdown() {
    const inputVal = countdownInput.value.trim();

    const format = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!format.test(inputVal)) {
        alert('Please enter a valid countdown time in the format hh:mm:ss');
        return;
    }

    const time= inputVal.split(':');

    totalSeconds = (parseInt(time[0]* 3600)) + (parseInt(time[1] * 60) )+ parseInt(time[2]);

    remainingTime = totalSeconds;

    countdownInput.disabled = true;
    start.disabled = true;
    countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    remainingTime--;
    count++ ;
    if (remainingTime <= 0) {
        clearInterval(countdownTimer);
        countdownInput.value = '00:00:00';
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        countdownInput.disabled = false;
        start.disabled = false;
        return;
    }

    const hours = Math.floor(remainingTime / 3600);
    remainingTime = remainingTime % 3600;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    countdownInput.value = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    
    const progress = Math.round(((totalSeconds - remainingTime) / totalSeconds) * 100);
    progressText.textContent = progress + "%";
    if(count == 5){
         progressFill.style.width = progress + "%";
         count = 0;
    }
}