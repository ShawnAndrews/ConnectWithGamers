import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Topnav from './Topnav';

export enum GAMINGNAV_PAGE {
    TWITCH = '/menu/gaming/twitch',
    STEAM = '/menu/gaming/steam',
    DISCORD = '/menu/gaming/discord'
}

interface ITopnavContainerProps extends RouteComponentProps<any> { } 

interface ITopnavContainerState {
    index: number;
} 

class TopnavContainer extends React.Component<ITopnavContainerProps, ITopnavContainerState> {

    constructor(props: ITopnavContainerProps) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.updateNavSelection = this.updateNavSelection.bind(this);
        this.updateNavSelection(this.props.history.location.pathname);

        this.state = {
            index: undefined
        };
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