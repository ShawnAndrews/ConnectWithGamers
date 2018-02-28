import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { NAV_PAGE } from '../app/app';

import { Tabs, Tab } from 'material-ui/Tabs';

interface INavbarProps {
    page: NAV_PAGE;
    history: any;
}

class Navbar extends React.Component<INavbarProps, any> {

    constructor(props: INavbarProps) {
        super(props);
        this.goToHomePage = this.goToHomePage.bind(this);
        this.goToMenuPage = this.goToMenuPage.bind(this);
        this.goToAccountPage = this.goToAccountPage.bind(this);
        
        if (this.props.page === NAV_PAGE.HOME) {
            this.state = { index: 0 };
        } else if (this.props.page === NAV_PAGE.MENU) {
            this.state = { index: 1 };
        } else if (this.props.page === NAV_PAGE.ACCOUNT) {
            this.state = { index: 2 };
        } else {
            this.state = { index: -1};
        }
        console.log(`CURRENT PAGE: ${this.props.page}`);
    }

    private goToHomePage(): void {
        this.setState({ index: 0 });
        this.props.history.push('/');
    }

    private goToMenuPage(): void {
        this.setState({ index: 1 });
        this.props.history.push('/menu');
    }

    private goToAccountPage(): void {
        this.setState({ index: 2 });
        this.props.history.push('/account');
    }

    render() {
        const translucentNav = {
            'background-color': 'rgba(0,0,0,0.5)',
            'height': '70px'
        };

        const underlineNav = {
            'background-color': 'whitesmoke'
        };

        console.log(`State: ${JSON.stringify(this.state)}`);
        return (
            <Tabs
                inkBarStyle={underlineNav} 
                tabItemContainerStyle={translucentNav}
                value={this.state.index}
            >
                <Tab label="Home" value={0} icon={<i className="fas fa-home navbar-item-icon"/>} className="navbar-item-text" onActive={this.goToHomePage}/>
                <Tab label="Menu" value={1} icon={<i className="fas fa-bars navbar-item-icon"/>} className="navbar-item-text" onActive={this.goToMenuPage}/>
                <Tab label="Account" value={2} icon={<i className="far fa-user navbar-item-icon"/>} className="navbar-item-text" onActive={this.goToAccountPage}/>
            </Tabs>
        );
    }

}

export default withRouter(Navbar);