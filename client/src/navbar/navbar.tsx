import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { NAV_PAGE } from '../app/app';
import { Tabs, Tab } from 'material-ui/Tabs';

interface INavbarProps {
    history: any;
}

class Navbar extends React.Component<INavbarProps, any> {

    constructor(props: INavbarProps) {
        super(props);
        this.goToHomePage = this.goToHomePage.bind(this);
        this.goToMenuPage = this.goToMenuPage.bind(this);
        this.goToChatroomPage = this.goToChatroomPage.bind(this);
        this.goToAccountPage = this.goToAccountPage.bind(this);
        this.updateNavSelection = this.updateNavSelection.bind(this);
        this.updateNavSelection(this.props.history.location.pathname);
    }

    public componentWillReceiveProps(newProps: INavbarProps) {
        this.updateNavSelection(newProps.history.location.pathname);
    }

    private updateNavSelection(path: string): void {
        if (path === NAV_PAGE.HOME) {
            this.state = { index: 0 };
        } else if (path.startsWith(NAV_PAGE.MENU)) {
            this.state = { index: 1 };
        } else if (path.startsWith(NAV_PAGE.CHATROOM)) {
            this.state = { index: 2 };
        } else if (path.startsWith(NAV_PAGE.ACCOUNT)) {
            this.state = { index: 3 };
        } else {
            this.state = { index: -1};
        }
    }

    private goToHomePage(): void {
        this.setState({ index: 0 });
        this.props.history.push(NAV_PAGE.HOME);
    }

    private goToMenuPage(): void {
        this.setState({ index: 1 });
        this.props.history.push(NAV_PAGE.MENU);
    }

    private goToChatroomPage(): void {
        this.setState({ index: 2 });
        this.props.history.push(NAV_PAGE.CHATROOM);
    }

    private goToAccountPage(): void {
        this.setState({ index: 3 });
        this.props.history.push(NAV_PAGE.ACCOUNT);
    }

    render() {

        return (
            <Tabs
                className="navbar-item-container"
                value={this.state.index}
            >
                <Tab label="Home" value={0} icon={<i className="fas fa-home navbar-item-icon"/>} className="navbar-item-text" onActive={this.goToHomePage}/>
                <Tab label="Menu" value={1} icon={<i className="fas fa-bars navbar-item-icon"/>} className="navbar-item-text" onActive={this.goToMenuPage}/>
                <Tab label="Chat" value={2} icon={<i className="fas fa-comments navbar-item-icon"/>} className="navbar-item-text" onActive={this.goToChatroomPage}/>
                <Tab label="Account" value={3} icon={<i className="far fa-user navbar-item-icon"/>} className="navbar-item-text" onActive={this.goToAccountPage}/>
            </Tabs>
        );
    }

}

export default withRouter(Navbar);