const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NAV_PAGE } from '../app/app';
import Navbar from './navbar';

interface INavbarContainerProps extends RouteComponentProps<any> { } 

class NavbarContainer extends React.Component<INavbarContainerProps, any> {

    constructor(props: INavbarContainerProps) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.updateNavSelection = this.updateNavSelection.bind(this);
        this.updateNavSelection(this.props.history.location.pathname);
    }

    componentWillReceiveProps(newProps: INavbarContainerProps) {
        this.updateNavSelection(newProps.history.location.pathname);
    }

    updateNavSelection(path: string): void {
        if (path === NAV_PAGE.HOME) {
            this.state = { index: 0 };
        } else if (path.startsWith(NAV_PAGE.MENU)) {
            this.state = { index: 1 };
        } else if (path.startsWith(NAV_PAGE.CHATROOM)) {
            this.state = { index: 2 };
        } else if (path.startsWith(NAV_PAGE.ACCOUNT)) {
            this.state = { index: 3 };
        } else {
            this.state = { index: -1 };
        }
    }

    onTabChange(event: React.ChangeEvent<{}>, value: any): void {
        this.setState({ index: value });
        if (value === 0) {
            this.props.history.push(NAV_PAGE.HOME);
        } else if (value === 1) {
            this.props.history.push(NAV_PAGE.MENU);
        } else if (value === 2) {
            this.props.history.push(NAV_PAGE.CHATROOM);
        } else if (value === 3) {
            this.props.history.push(NAV_PAGE.ACCOUNT);
        }
    }

    render() {
        return (
            <Navbar
                index={this.state.index}
                onTabChange={this.onTabChange}
            />
        );
    }

}

export default withRouter(NavbarContainer);