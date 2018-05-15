import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Topnav from './Topnav';

export enum GAMINGNAV_PAGE {
    TWITCH = '/menu/gaming/twitch',
    STEAM = '/menu/gaming/steam',
    DISCORD = '/menu/gaming/discord'
}

interface ITopnavContainerProps {
    history: any;
    match?: any;
}

class TopnavContainer extends React.Component<ITopnavContainerProps, any> {

    constructor(props: ITopnavContainerProps) {
        super(props);
        this.goToTwitchPage = this.goToTwitchPage.bind(this);
        this.goToSteamPage = this.goToSteamPage.bind(this);
        this.goToDiscordPage = this.goToDiscordPage.bind(this);
        this.updateNavSelection(this.props.history.location.pathname);
    }

    componentWillReceiveProps(newProps: ITopnavContainerProps) {
        this.updateNavSelection(newProps.history.location.pathname);
    }

    updateNavSelection(path: string): void {
        if (path === GAMINGNAV_PAGE.TWITCH) {
            this.state = { index: 0 };
        } else if (path.startsWith(GAMINGNAV_PAGE.STEAM)) {
            this.state = { index: 1 };
        } else if (path.startsWith(GAMINGNAV_PAGE.DISCORD)) {
            this.state = { index: 2 };
        } else {
            this.state = { index: -1};
        }
    }

    goToTwitchPage(): void {
        this.setState({ index: 0 });
        this.props.history.push(GAMINGNAV_PAGE.TWITCH);
    }

    goToSteamPage(): void {
        this.setState({ index: 1 });
        this.props.history.push(GAMINGNAV_PAGE.STEAM);
    }

    goToDiscordPage(): void {
        this.setState({ index: 2 });
        this.props.history.push(GAMINGNAV_PAGE.DISCORD);
    }

    render() {
        return (
            <Topnav
                index={this.state.index}
                goToTwitchPage={this.goToTwitchPage}
                goToSteamPage={this.goToSteamPage}
                goToDiscordPage={this.goToDiscordPage}
            />
        );
    }

}

export default withRouter(TopnavContainer);