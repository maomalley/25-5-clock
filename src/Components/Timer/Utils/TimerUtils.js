import dayjs from 'dayjs';

export function getTimeRemainingUntilTimestampMS(timestampMS) {
    const timestampDayjs = dayjs(timestampMS);
    const nowDayjs = dayjs();
    if(timestampDayjs.isBefore(nowDayjs)){
        return{
            seconds: '00',
            minutes: '00',
        }
    }
    return {
        seconds: getRemainingSeconds(nowDayjs, timestampDayjs),
        minutes: getRemainingMinutes(nowDayjs, timestampDayjs),
    }
}

function getRemainingSeconds(nowDayjs, timestampDayjs){
    // -> 80 -> 1m 20s, fix using mod 60
    const seconds = timestampDayjs.diff(nowDayjs, 'seconds') % 60;
    return seconds;
}

function getRemainingMinutes(nowDayjs, timestampDayjs){
    // 80m -> 1h 20m, but no hours so no mod
    const minutes = timestampDayjs.diff(nowDayjs, 'minutes');
    return minutes;
}