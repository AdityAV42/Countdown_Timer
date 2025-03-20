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

let countdownValue = Date;          //date type variable
let countdownActive;

//all time in milli sec
const second = 1000;             //1s = 1000ms
const minute = second * 60;     //1min = 60s  
const hour = minute * 60;       //1h = 60min
const day = hour * 24;          //1d = 24h

let title ='';
let date = '';

let today = new Date().toISOString().split('T')[0];      //after split it becomes array , so access 1st part
// console.log(today);
datePicker.setAttribute('min', today)             //set miniumum date


function updateDom() {
    countdownActive = setInterval(() => {
        let now = new Date().getTime();
        let distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const mins = Math.floor((distance % hour) / minute);
        const secs = Math.floor((distance % minute) / second);

        if (distance < 0) {
            counterEl.hidden = true;
            counterFormArea.hidden = true;
            complete.hidden = false;

            clearInterval(countdownActive);
            completeInfo.textContent = `${title} completed on ${date}`;
        } else {
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
    e.preventDefault();     //page doesn't reload after submit button is clicked 
    title = e.srcElement[0].value;
    date = e.srcElement[1].value;
    
    console.log(title, date);
    // console.log(e);         //details of the form

    const savedCountdown = {    //object
        title : title,
        date : date
    };

    localStorage.setItem('countdown', JSON.stringify(savedCountdown));          //key, value

    if(date === ""){
        alert('Please Enter a date!');
    }
    else{   
        countdownValue = new Date(date).getTime();    
        // console.log(countdownValue);
        updateDom();
    }
}


function reset(){
    localStorage.removeItem('countdown');
    counterEl.hidden = true;
    complete.hidden = true; 
    clearInterval(countdownActive);
    title = '';
    date = '';
    counterFormArea.hidden = false;
}

function restoreCountdown(){
    if(localStorage.getItem('countdown')){      //check if key 'countdown' present 
        counterFormArea.hidden = true;
        
        let countdownData = JSON.parse(localStorage.getItem('countdown'));
        title = countdownData.title;
        date = countdownData.date;

        countdownValue = new Date(date).getTime();    
        updateDom();
    }
}

counterForm.addEventListener('submit', updateCountdown);

counterResetBtn.addEventListener('click', reset);

completeBtn.addEventListener('click', reset);

restoreCountdown();






 
//make calendar to have date and time both setting
// give notification, send mail to user that 5 min left, 1 min left , expired mail
//Add Sound or Notification When Timer Expires