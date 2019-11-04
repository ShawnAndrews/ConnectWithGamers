import * as React from 'react';

interface ITimerBannerProps {
    totalDiscountSecondsLeft: number;
}

const TimerBanner: React.SFC<ITimerBannerProps> = (props: ITimerBannerProps) => {

    const toHHMMSS = (totalSeconds: number): string  => {
        let hours: string   = Math.floor(totalSeconds / 3600).toString();
        let minutes: string = Math.floor((totalSeconds - (parseInt(hours) * 3600)) / 60).toString();
        let seconds: string = (totalSeconds - (parseInt(hours) * 3600) - (parseInt(minutes) * 60)).toString();
    
        if (parseInt(hours)   < 10) {hours   = "0"+hours;}
        if (parseInt(minutes) < 10) {minutes = "0"+minutes;}
        if (parseInt(seconds) < 10) {seconds = "0"+seconds;}
        return hours + ':' + minutes + ':' + seconds;
    }

    return (
        <>
            {toHHMMSS(props.totalDiscountSecondsLeft)} left
        </>
    );

};

export default TimerBanner;
