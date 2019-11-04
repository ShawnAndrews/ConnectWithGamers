import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import TimerBanner from './TimerBanner';

interface ITimerBannerContainerProps extends RouteComponentProps<any> {
    discountEndDt: Date;
}

interface ITimerBannerContainerState {
    totalDiscountSecondsLeft: number
}

class TimerBannerContainer extends React.Component<ITimerBannerContainerProps, ITimerBannerContainerState> {

    constructor(props: ITimerBannerContainerProps) {
        super(props);
        this.updateDiscountSeconds = this.updateDiscountSeconds.bind(this);

        this.state = {
            totalDiscountSecondsLeft: undefined
        };

        setInterval(this.updateDiscountSeconds, 500);
    }

    updateDiscountSeconds(): void {
        const totalDiscountSecondsLeft: number = Math.floor((this.props.discountEndDt.getTime() - new Date().getTime()) / 1000 )
        this.setState({totalDiscountSecondsLeft: totalDiscountSecondsLeft});
    }

    render() {
        return (
            <TimerBanner
                totalDiscountSecondsLeft={this.state.totalDiscountSecondsLeft}
            />
        );
    }

}

export default withRouter(TimerBannerContainer);