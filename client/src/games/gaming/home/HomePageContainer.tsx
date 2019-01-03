import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from './HomePage';

interface IHomePageContainerProps extends RouteComponentProps<any> { } 

interface IHomePageContainerState { } 

class HomePageContainer extends React.Component<IHomePageContainerProps, IHomePageContainerState> {

    constructor(props: IHomePageContainerProps) {
        super(props);
        this.onClickTwitch = this.onClickTwitch.bind(this);
        this.onClickSteam = this.onClickSteam.bind(this);
        this.onClickDiscord = this.onClickDiscord.bind(this);
    }

    onClickTwitch(): void {
        this.props.history.push('/games/gaming/twitch');
    }

    onClickSteam(): void {
        this.props.history.push('/games/gaming/steam');
    }

    onClickDiscord(): void {
        this.props.history.push('/games/gaming/discord');
    }

    render() {
        return (
            <HomePage
                onClickTwitch={this.onClickTwitch}
                onClickSteam={this.onClickSteam}
                onClickDiscord={this.onClickDiscord}
            />
        );
    }

}

export default withRouter(HomePageContainer);