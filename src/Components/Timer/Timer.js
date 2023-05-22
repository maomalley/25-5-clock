import './Timer.css';
import {useState, useEffect} from 'react';
import {getTimeRemainingUntilTimestampMS} from './Utils/TimerUtils';
import dayjs from "dayjs";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';

let timestampMS = dayjs().add(25, "minutes");
let workMins = 25;

const defaultTimeRemaining = {
    seconds: 0,
    minutes: 0,
}

let pausedTimeRemaining = {
    seconds: 0,
    minutes: 0,
}

let isPaused = false;
let isStarted = false;

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

    function reset() {
        //make the paused time remaining 0
        setPausedTimeRemaining(0, 25);
        //reset the dayjs
        timestampMS = dayjs().second(0).minute(0);
        // make the dayjs 25 mins
        timestampMS = dayjs().add(25, "minutes");
    }

    function incWorkLen() {
        // setPausedTimeRemaining(timeRemaining.seconds, timeRemaining.minutes + 1);
        pausedTimeRemaining.minutes++;
        timestampMS = timestampMS.add(1,"minutes");
        workMins = workMins+1;
    }

    function start() {
        reset();
        isStarted = true;
    }


    useEffect(() => {

            const intervalId = setInterval(() => {
                if (isStarted) {
                    updateRemainingTime(timestampMS);
                }
            }, 1000);
            return () => clearInterval(intervalId);

    }, [timestampMS])

    function updateRemainingTime(countdown) {
        setTimeRemaining(getTimeRemainingUntilTimestampMS(countdown));
    }


    if (isPaused) {
        return (
            <div className="timers">
                <div className="timer">
                    <span>{pausedTimeRemaining.minutes}</span>
                    <span>minutes</span>
                    <span>{pausedTimeRemaining.seconds}</span>
                    <span>seconds</span>
                </div>
                <div className="controls">
                    <span>
                    <button onClick={() => unpause()}>
                        UnPause
                    </button>
                    <button onClick={() => reset()}>
                        Reset
                    </button>
                </span>
                    <span>
                        <span>Set Work Length Minutes:</span>
                        <button onClick={() => incWorkLen()}>
                            <FontAwesomeIcon icon={faArrowUp}/>
                        </button>
                        <span>{ workMins }</span>
                        <button>
                            <FontAwesomeIcon icon={faArrowDown}/>
                        </button>
                    </span>
                </div>
            </div>
        );
    } else {
        return (
            <div className="timers">
                <div className="timer">
                    <span>{timeRemaining.minutes}</span>
                    <span>minutes</span>
                    <span>{timeRemaining.seconds}</span>
                    <span>seconds</span>
                </div>
                <div className="controls">
                    <span>
                        <button onClick={() => start()}>
                            Start
                        </button>
                    </span>
                    <span>
                    <button onClick={() => pause()}>
                        Pause
                    </button>
                    <button onClick={() => reset()}>
                        Reset
                    </button>
                </span>
                    <span>
                        <span>Set Work Length Minutes:</span>
                        <button onClick={() => incWorkLen()}>
                            <FontAwesomeIcon icon={faArrowUp}/>
                        </button>
                        <span>{ workMins }</span>
                        <button>
                            <FontAwesomeIcon icon={faArrowDown}/>
                        </button>
                    </span>
                </div>
            </div>
        );
    }
}

export default Timer;