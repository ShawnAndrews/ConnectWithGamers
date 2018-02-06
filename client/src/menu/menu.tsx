import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface IMenuProps {
    history: any;
}

class Menu extends React.Component<IMenuProps, any> {

    constructor(props: IMenuProps) {
        super(props);
    }

    render() {

        return (
            <div className="menu">
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    Upcoming Games
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    Most Popular Games
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    By Platform
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    Upcoming Games
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    Most Popular Games
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    By Platform
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    Upcoming Games
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    Most Popular Games
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    By Platform
                </div>
            </div>
        );

    }

}

export default withRouter(Menu);