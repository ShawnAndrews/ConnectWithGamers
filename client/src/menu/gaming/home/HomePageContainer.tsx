const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from './HomePage';

interface IHomePageContainerProps extends RouteComponentProps<any> { } 

class HomePageContainer extends React.Component<IHomePageContainerProps, any> {

    constructor(props: IHomePageContainerProps) {
        super(props);
        this.onClickTwitch = this.onClickTwitch.bind(this);
        this.onClickSteam = this.onClickSteam.bind(this);
        this.onClickDiscord = this.onClickDiscord.bind(this);
    }

    onClickTwitch(): void {
        this.props.history.push('/menu/gaming/twitch');
    }

    onClickSteam(): void {
        this.props.history.push('/menu/gaming/steam');
    }

    onClickDiscord(): void {
        this.props.history.push('/menu/gaming/discord');
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