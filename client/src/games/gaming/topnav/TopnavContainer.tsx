import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Topnav from './Topnav';

export enum GAMINGNAV_PAGE {
    TWITCH = '/games/gaming/twitch',
    STEAM = '/games/gaming/steam',
    DISCORD = '/games/gaming/discord'
}

interface ITopnavContainerProps extends RouteComponentProps<any> { } 

interface ITopnavContainerState {
    index: number;
} 

class TopnavContainer extends React.Component<ITopnavContainerProps, ITopnavContainerState> {

    constructor(props: ITopnavContainerProps) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);

        this.state = {
            index: this.detectNavSelection(this.props.history.location.pathname)
        };
    }

    componentWillReceiveProps(newProps: ITopnavContainerProps) {
        this.setState({ index: this.detectNavSelection(newProps.history.location.pathname) });
    }

    detectNavSelection(path: string): number {
        if (path.startsWith(GAMINGNAV_PAGE.TWITCH)) {
            return 0;
        } else if (path.startsWith(GAMINGNAV_PAGE.STEAM)) {
            return 1;
        } else if (path.startsWith(GAMINGNAV_PAGE.DISCORD)) {
            return 2;
        } else {
            return -1;
        }
    }

    onTabChange(event: React.ChangeEvent<{}>, value: any): void {
        this.setState({ index: value });
        if (value === 0) {
            this.props.history.push(GAMINGNAV_PAGE.TWITCH);
        } else if (value === 1) {
            this.props.history.push(GAMINGNAV_PAGE.STEAM);
        } else if (value === 2) {
            this.props.history.push(GAMINGNAV_PAGE.DISCORD);
        }
    }

    render() {
        return (
            <Topnav
                index={this.state.index}
                onTabChange={this.onTabChange}
            />
        );
    }

}

export default withRouter(TopnavContainer);