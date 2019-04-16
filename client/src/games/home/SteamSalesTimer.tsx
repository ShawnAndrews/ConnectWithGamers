import * as React from 'react';

interface ISteamSalesTimerProps {
    timeToNextMondayMs: number;
}

const SteamSalesTimer: React.SFC<ISteamSalesTimerProps> = (props: ISteamSalesTimerProps) => {
    
    const days: number = Math.floor(props.timeToNextMondayMs / 86400);
    const hours: number = Math.floor(props.timeToNextMondayMs / 3600) % 24;
    const minutes: number = Math.floor(props.timeToNextMondayMs / 60) % 60;
    const seconds: number = Math.trunc(props.timeToNextMondayMs % 60);

    return (
        <>
            Steam sales – {days}d {hours}h {minutes}m {seconds}s
        </>
    );

};

export default SteamSalesTimer;
