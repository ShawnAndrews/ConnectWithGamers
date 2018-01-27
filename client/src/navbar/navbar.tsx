import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { NAV_PAGE } from '../app/app'; 

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
    }

    private goToHomePage(): void {
        this.props.history.push('/');
    }

    private goToMenuPage(): void {
        this.props.history.push('/menu');
    }

    private goToAccountPage(): void {
        this.props.history.push('/account');
    }

    render() {
        console.log(`State: ${JSON.stringify(this.state)}`);
        return (
            <div className="navbar">
                <div className={`navbar-item ${this.props.page === NAV_PAGE.HOME && 'navbar-item-selected'}`} onClick={this.goToHomePage}>
                    <i className="fa fa-home navbar-item-text" aria-hidden="true">
                        &nbsp;&nbsp;Home
                    </i>
                </div>
                <div className="navbar-left-divider"/>
                <div className={`navbar-item ${this.props.page === NAV_PAGE.MENU && 'navbar-item-selected'}`} onClick={this.goToMenuPage}>
                    <i className="fa fa-bars navbar-item-text" aria-hidden="true">
                        &nbsp;&nbsp;Menu
                    </i>
                </div>
                <div className="navbar-left-divider"/>
                <div className={`navbar-item ${this.props.page === NAV_PAGE.ACCOUNT && 'navbar-item-selected'}`} onClick={this.goToAccountPage}>
                    <i className="fa fa-user navbar-item-text" aria-hidden="true">
                        &nbsp;&nbsp;Account
                    </i>
                </div>
            </div>
        );
    }

}

export default withRouter(Navbar);