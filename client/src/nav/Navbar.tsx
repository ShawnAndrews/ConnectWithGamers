import * as React from 'react';
import { NAV_PAGE } from '../app/app';
import { Tabs, Tab } from 'material-ui/Tabs';

interface INavbarProps {
    index: number;
    goToHomePage: () => void;
    goToMenuPage: () => void;
    goToChatroomPage: () => void;
    goToAccountPage: () => void;
}

const Navbar: React.SFC<INavbarProps> = (props: INavbarProps) => {

    return (
        <Tabs
            className="navbar-item-container fixed-container"
            value={props.index}
        >
            <Tab label="Home" value={0} icon={<i className="fas fa-home navbar-item-icon"/>} className="navbar-item-text" onActive={props.goToHomePage}/>
            <Tab label="Menu" value={1} icon={<i className="fas fa-bars navbar-item-icon"/>} className="navbar-item-text" onActive={props.goToMenuPage}/>
            <Tab label="Chat" value={2} icon={<i className="fas fa-comments navbar-item-icon"/>} className="navbar-item-text" onActive={props.goToChatroomPage}/>
            <Tab label="Account" value={3} icon={<i className="far fa-user navbar-item-icon"/>} className="navbar-item-text" onActive={props.goToAccountPage}/>
        </Tabs>
    );

};

export default Navbar;