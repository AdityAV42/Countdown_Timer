const endDate = new Date("18 Mar, 2026 20:00:00").getTime();    //future date ... convert to milli seconds .getTime()
const startDate = new Date().getTime();                         //current date in milli sec

function updateTimer(){
    const now = new Date().getTime();            //currentDate

    const distanceCovered = now - startDate;     //elapsed time
    const distancePending = endDate - now;      //remaining time

    //calculate days, min, hours, sec remaining from distancePending
    //1 day = 24hrs * 60min * 60sec * 1000 ms
    const oneDayInMillis = (24 * 60 * 60 * 1000);
    const oneHourInMillis = (60 * 60 * 1000);
    const oneMinInMillis = (60 * 1000);
    const oneSecInMillis = (1000);

    const days = Math.floor(distancePending / oneDayInMillis);
    const hours = Math.floor( ((distancePending % oneDayInMillis) / oneHourInMillis) );
    const min =  Math.floor( (distancePending % oneHourInMillis) / oneMinInMillis );
    const sec = Math.floor( (distancePending % oneMinInMillis) / oneSecInMillis );

    //populate in UI
    document.getElementById('days').innerHTML = days;
    document.getElementById('hours').innerHTML = hours;
    document.getElementById('minutes').innerHTML = min;
    document.getElementById('seconds').innerHTML = sec;

    //calculate width percentage for progress bar
    const totalDistance = endDate - startDate;
    const percentageDistance = (distanceCovered / totalDistance) * 100;

    //set Width for progress Bar
    document.getElementById('progress-bar').style.width = percentageDistance + "%";     //string concatenates eg: width="27%";
    
    if(distancePending < 0){
        clearInterval(x);
        document.getElementById('countdown').innerHTML = "EXPIRED";
        document.getElementById('progress-bar').style.width = "100%";
    }
}

const x = setInterval(updateTimer, 1000);                 //1 sec = 1000ms


//i want every circle of time div to be of same dimension
//give option to user to reset, 
// give option to user to choose start , end date  
// give notification, send mail to user that 5 min left, 1 min left , expired mail
//Add Sound or Notification When Timer Expires
//Add a Pause Button
//Add a Dynamic Background