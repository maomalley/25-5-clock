import './Timer.css';
import {useState, useEffect} from 'react';
import {getTimeRemainingUntilTimestampMS} from './Utils/TimerUtils';
import dayjs from "dayjs";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';

//TODO: add audio beeps
//TODO: allow timer to fully reach 00 seconds
//TODO: add caps to break and session lengths to 60 mins
//TODO: page styling

let timestampMS = dayjs().add(25, "minutes");
let workMins = 25;
let breakMins = 5;
let workOrBreak = "Work";

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
    //TODO: DEC WORK LEN
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
        workMins = 25;
        breakMins = 5;
        workOrBreak = "Work";
    }

    function moveToBreak() {
        setPausedTimeRemaining(0, 5);
        //reset the dayjs
        timestampMS = dayjs().second(0).minute(0);
        // make the dayjs -5 mins- the length of breakMins
        timestampMS = dayjs().add(breakMins, "minutes");
        workOrBreak = "Break";
        // console.log("moved to break");
    }

    function moveToWork() {
        //make the paused time remaining 0
        setPausedTimeRemaining(0, workMins);
        //reset the dayjs
        timestampMS = dayjs().second(0).minute(0);
        // make the dayjs 25 mins
        timestampMS = dayjs().add(workMins, "minutes");
        workOrBreak = "Work";
    }

    function incWorkLen() {
        if (workOrBreak === "Work") {
            pausedTimeRemaining.minutes++;
            timestampMS = timestampMS.add(1, "minutes");
        }
        workMins = workMins+1;
    }

    function decWorkLen() {
        // setPausedTimeRemaining(timeRemaining.seconds, timeRemaining.minutes + 1);
        if (workMins > 1) {
            if (workOrBreak === "Work") {
                pausedTimeRemaining.minutes--;
                timestampMS = timestampMS.subtract(1, "minutes");
            }
            workMins = workMins - 1;
        }
    }

    function incBreakLen() {
        if (workOrBreak === "Break") {
            pausedTimeRemaining.minutes++;
            timestampMS = timestampMS.add(1, "minutes");
        }
        breakMins = breakMins+1;
    }

    function decBreakLen() {
        if (breakMins > 1) {
            if (workOrBreak === "Break") {
                pausedTimeRemaining.minutes--;
                timestampMS = timestampMS.subtract(1, "minutes");
            }
            breakMins = breakMins - 1;
        }
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

    let changeTime;
    function updateRemainingTime(countdown) {
        changeTime = getTimeRemainingUntilTimestampMS(countdown);
        setTimeRemaining(changeTime);

        if (changeTime.seconds <= 0 && changeTime.minutes <= 0 && workOrBreak === "Work" && !isPaused) {
            // console.log("break time");
            moveToBreak();
        } else if (changeTime.seconds <= 1 && changeTime.minutes <= 0 && workOrBreak === "Break" && !isPaused) {
            moveToWork();
        }
    }


    if (isPaused) {
        return (
            <div className="timers">
                <span> {workOrBreak} </span>
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
                        <button onClick={()=>decWorkLen()}>
                            <FontAwesomeIcon icon={faArrowDown}/>
                        </button>
                    </span>
                    <span>
                        <span>Set Break Length Minutes:</span>
                        <button onClick={() => incBreakLen()}>
                            <FontAwesomeIcon icon={faArrowUp}/>
                        </button>
                        <span>{ breakMins }</span>
                        <button onClick={() => decBreakLen()}>
                            <FontAwesomeIcon icon={faArrowDown}/>
                        </button>
                    </span>
                </div>
            </div>
        );
    } else {
        return (
            <div className="timers">
                <span> {workOrBreak} </span>
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
                        <button onClick={()=>decWorkLen()}>
                            <FontAwesomeIcon icon={faArrowDown}/>
                        </button>
                    </span>
                    <span>
                        <span>Set Break Length Minutes:</span>
                        <button onClick={() => incBreakLen()}>
                            <FontAwesomeIcon icon={faArrowUp}/>
                        </button>
                        <span>{ breakMins }</span>
                        <button onClick={() => decBreakLen()}>
                            <FontAwesomeIcon icon={faArrowDown}/>
                        </button>
                    </span>
                </div>
            </div>
        );
    }
}

export default Timer;