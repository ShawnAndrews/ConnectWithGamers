import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface INavbarProps {
    history: any;
}

class Navbar extends React.Component<INavbarProps, any> {

    constructor(props: INavbarProps) {
        super(props);
        this.goToHomePage = this.goToHomePage.bind(this);
        this.goToAccountPage = this.goToAccountPage.bind(this);
    }

    private goToHomePage(): void {
        this.props.history.push('/');
    }

    private goToAccountPage(): void {
        this.props.history.push('/account');
    }

    render() {

        return (
            <div className="navbar">
                <div className="navbar-item" onClick={this.goToHomePage}>
                    <i className="fa fa-home" aria-hidden="true">
                        &nbsp;Home
                    </i>
                    <span className="navbar-left-divider">
                        ·
                    </span>
                </div>
                <div className="navbar-item">
                    <i className="fa fa-search" aria-hidden="true">
                        &nbsp;Find match
                    </i>
                </div>
                <div className="navbar-item" onClick={this.goToAccountPage}>
                    <span className="navbar-right-divider">
                        ·
                    </span>
                    <i className="fa fa-user" aria-hidden="true">
                        &nbsp;Account
                    </i>
                </div>
            </div>
        );
    }

}

export default withRouter(Navbar);