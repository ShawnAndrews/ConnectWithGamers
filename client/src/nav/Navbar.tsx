import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { loggedIn } from '../service/account/main';
import AppBar from '@material-ui/core/AppBar';

interface INavbarProps {
    index: number;
    onTabChange: (event: React.ChangeEvent<{}>, value: any) => void;
}

const Navbar: React.SFC<INavbarProps> = (props: INavbarProps) => {

    return (
        <AppBar position="static">
            <Tabs
                className={`navbar-item-container fixed-container ${props.index === 3 && !loggedIn() && `invisible` }`}
                onChange={props.onTabChange}
                value={props.index}
                fullWidth={true}
            >
                <Tab label="Home" icon={<i className="fas fa-home navbar-item-icon"/>} className="navbar-item-text"/>
                <Tab label="Menu" icon={<i className="fas fa-bars navbar-item-icon"/>} className="navbar-item-text"/>
                <Tab label="Chat" icon={<i className="fas fa-comments navbar-item-icon"/>} className="navbar-item-text"/>
                <Tab label="Account" icon={<i className="far fa-user navbar-item-icon"/>} className="navbar-item-text"/>
            </Tabs>
        </AppBar>
    );

};

export default Navbar;