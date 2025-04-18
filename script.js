//storing elements as constants to reduce dom writing everytime
const counterFormArea = document.querySelector('.form-area');
const counterForm = document.getElementById('counter-form');

const counterEl = document.getElementById('counter');
const counterTitleEl = document.getElementById('counter-title');      
const counterResetBtn = document.getElementById('counter-reset');
const datePicker = document.getElementById('counter-date');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const complete = document.getElementById('complete');
const completeInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');
const progressBar = document.getElementById('progress-bar'); // Add progress bar reference

const timerSound = document.getElementById('timer-sound');

let countdownValue = Date;          //date type variable
let countdownActive;

//all time in milli sec
const second = 1000;             //1s = 1000ms
const minute = second * 60;     //1min = 60s  
const hour = minute * 60;       //1h = 60min
const day = hour * 24;          //1d = 24h

let title ='';
let date = '';

let startDate; // Add start date variable
let endDate;   // Add end date variable

// Set minimum selectable date and time dynamically
let now = new Date().toISOString().slice(0, 16); // Includes time up to minutes
datePicker.setAttribute('min', now); // Set min attribute to current datetime

function updateDom() {
    countdownActive = setInterval(() => {
        let now = new Date().getTime();
        let distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const mins = Math.floor((distance % hour) / minute);
        const secs = Math.floor((distance % minute) / second);

        // Calculate progress percentage correctly
        const totalDistance = endDate - startDate;
        const distanceCovered = now - startDate;
        const percentageDistance = (distanceCovered / totalDistance) * 100;

        // Ensure percentage stays within 0-100%
        const progressPercentage = Math.min(Math.max(percentageDistance, 0), 100);

        // Save the correct progress value as a string
        localStorage.setItem('countdownProgress', progressPercentage.toFixed(2)); // Ensures 2 decimal places
        
        progressBar.style.width = `${progressPercentage}%`;

        if (distance < 0) {
            counterEl.hidden = true;
            counterFormArea.hidden = true;
            complete.hidden = false;

            clearInterval(countdownActive);
            completeInfo.textContent = `${title} completed on ${date}`;
            progressBar.style.width = "100%"; 
            localStorage.setItem('countdownProgress', "100"); 

            // Play the sound when the timer expires
            timerSound.play(); 
        } 
        else 
        {
            daysEl.textContent = days;
            hoursEl.textContent = hours;
            minutesEl.textContent = mins;
            secondsEl.textContent = secs;

            counterTitleEl.textContent = title;
            counterFormArea.hidden = true;
            counterEl.hidden = false;
        }
    }, 1000);
}


function updateCountdown(e){
    e.preventDefault();     
    title = e.srcElement[0].value;
    date = e.srcElement[1].value;
    
    if(date === ""){
        alert('Please Enter a date and time!');
        return;
    }
    
    startDate = new Date().getTime(); // Capture the start date only once
    endDate = new Date(date).getTime();
    countdownValue = endDate;    

    const savedCountdown = {    
        title: title,
        date: date,
        startDate: startDate  // Store start date in localStorage
    };

    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    
    updateDom();
}

function reset() {
    localStorage.removeItem('countdown');
    localStorage.removeItem('countdownProgress');
    counterEl.hidden = true;
    complete.hidden = true; 
    clearInterval(countdownActive);
    title = '';
    date = '';
    counterFormArea.hidden = false;

    progressBar.style.width = "0%";

    // Stop and reset the sound
    timerSound.pause(); // Stop the sound
    timerSound.currentTime = 0; // Reset the sound to the beginning
}


function restoreCountdown() {
    const savedCountdownData = localStorage.getItem('countdown');
    
    if (savedCountdownData) {      
        counterFormArea.hidden = true;
        
        let countdownData = JSON.parse(savedCountdownData);
        title = countdownData.title;
        date = countdownData.date;
        startDate = countdownData.startDate; 
        endDate = new Date(date).getTime(); 
        countdownValue = endDate;    

        const savedProgress = parseFloat(localStorage.getItem('countdownProgress'));
        
        if (!isNaN(savedProgress)) {
            progressBar.style.width = savedProgress + "%"; // Apply correct progress
            console.log(`Restored Progress Bar Width: ${progressBar.style.width}`);
        }

        updateDom();
    }
}

counterForm.addEventListener('submit', updateCountdown);

counterResetBtn.addEventListener('click', reset);

completeBtn.addEventListener('click', reset);

datePicker.addEventListener('input', () => {
    let selectedDateTime = new Date(datePicker.value);
    let now = new Date();

    // Ensure the selected time is not in the past
    if (selectedDateTime < now) {
        alert("You cannot select a past time!");
        datePicker.value = ""; // Reset the input field
    }
});

restoreCountdown();



//TO DO after learning backend:
// send mail to user that 5 min left, 1 min left , expired mail
//              -----> requires backend knowledge