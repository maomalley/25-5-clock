import './Timer.css';
import {useState, useEffect} from 'react';
import {getTimeRemainingUntilTimestampMS} from './Utils/TimerUtils';
import dayjs from "dayjs";

let timestampMS = dayjs().add(25,"minutes");

const defaultTimeRemaining = {
    seconds: '00',
    minutes: '00',
}

let pausedTimeRemaining = {
    seconds: '00',
    minutes: '00',
}

let isPaused = false;

function setPausedTimeRemaining(currSeconds, currMinutes) {
    pausedTimeRemaining.seconds = currSeconds;
    pausedTimeRemaining.minutes = currMinutes;
}


//old param: {timestampMS}
const Timer = () => {
    const [timeRemaining, setTimeRemaining] = useState(defaultTimeRemaining);

    function pause() {
        isPaused = true;
        // console.log("hit pause: " + isPaused);
        setPausedTimeRemaining(timeRemaining.seconds, timeRemaining.minutes);
    // console.log("You paused at (seconds, minutes): " + pausedTimeRemaining.seconds + pausedTimeRemaining.minutes);
        timestampMS = dayjs().second(0).minute(0);
        // console.log(timestampMS);
    }

    function unpause() {
        isPaused = false;
        // console.log("going to unpause using " + dayjs().second(pausedTimeRemaining.seconds).minute(pausedTimeRemaining.minutes));
        timestampMS = dayjs().add(pausedTimeRemaining.seconds, "seconds").add(pausedTimeRemaining.minutes, "minutes");
    }

    useEffect(() => {
        // if (!isPaused) {
        const intervalId = setInterval(() => {
            updateRemainingTime(timestampMS);
        }, 1000);
        return () => clearInterval(intervalId);
        // } else {
        //     console.log(isPaused);
        //     return () => {};
        // }
    }, [timestampMS])

    function updateRemainingTime(countdown) {
            setTimeRemaining(getTimeRemainingUntilTimestampMS(countdown));
    }


    if(isPaused){
        return(
            <div className = "timers">
                <div className="timer">
                    <span>{ pausedTimeRemaining.minutes }</span>
                    <span>minutes</span>
                    <span>{pausedTimeRemaining.seconds}</span>
                    <span>seconds</span>
                </div>
                <div className="controls">
                <span>
                    <button onClick={() => unpause()}>
                        UnPause
                    </button>
                </span>
                </div>
            </div>
        );
    } else {
        return(
            <div className = "timers">
                <div className="timer">
                    <span>{ timeRemaining.minutes }</span>
                    <span>minutes</span>
                    <span>{timeRemaining.seconds}</span>
                    <span>seconds</span>
                </div>
                <div className="controls">
                <span>
                    <button onClick={() => pause()}>
                        Pause
                    </button>
                </span>
                </div>
            </div>
        );
    }
}

export default Timer;