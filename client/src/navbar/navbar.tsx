import * as React from 'react';

interface INavbarProps {
    
}

class Navbar extends React.Component<INavbarProps, any> {

    constructor(props: INavbarProps) {
        super(props);
    }

    render() {

        return (
            <div className="navbar">
                <div className="navbar-item">
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
                <div className="navbar-item">
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

export default Navbar;