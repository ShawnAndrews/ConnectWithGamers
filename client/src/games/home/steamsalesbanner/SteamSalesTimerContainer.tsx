import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import SteamSalesTimer from './SteamSalesTimer';

interface ISteamSalesTimerContainerProps extends RouteComponentProps<any> {

}

interface ISteamSalesTimerContainerState {
    timeToNextMondayMs: number;
    intervalTimer: any
}

class SteamSalesTimerContainer extends React.Component<ISteamSalesTimerContainerProps, ISteamSalesTimerContainerState> {

    constructor(props: ISteamSalesTimerContainerProps) {
        super(props);
        this.getTimeToNextMondayMs = this.getTimeToNextMondayMs.bind(this);

        this.state = {
            timeToNextMondayMs: this.getTimeToNextMondayMs(),
            intervalTimer: setInterval(() => this.setState({ timeToNextMondayMs: this.getTimeToNextMondayMs() }), 1000)
        };

    }

    componentWillUnmount() {
        clearInterval(this.state.intervalTimer);
    }

    nextDayAndTime(dayOfWeek: number, hour: number, minute: number): Date {
        const now: Date = new Date();
        const result: Date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + (7 + dayOfWeek - now.getDay()) % 7,
            hour,
            minute);

        if (result < now) {
            result.setDate(result.getDate() + 7);
        }

        return result;
    }

    getTimeToNextMondayMs(): number {
        return (this.nextDayAndTime(1, 12, 0).getTime() - new Date().getTime()) / 1000;
    }
    
    render() {
        return (
            <SteamSalesTimer
                timeToNextMondayMs={this.state.timeToNextMondayMs}
            />
        );
    }

}

export default withRouter(SteamSalesTimerContainer);