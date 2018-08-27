import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

interface ITopnavProps {
    index: number;
    onTabChange: (event: React.ChangeEvent<{}>, value: any) => void;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {

    return (
        <Tabs
            className="gaming-navbar-item-container fixed-container"
            onChange={props.onTabChange}
            value={props.index}
            fullWidth={true}
        >
            <Tab icon={<i className="fab fa-twitch fa-2x navbar-item-icon"/>} className="navbar-item-text"/>
            <Tab icon={<i className="fab fa-steam-square fa-2x navbar-item-icon"/>} className="navbar-item-text"/>
            <Tab icon={<i className="fab fa-discord fa-2x navbar-item-icon"/>} className="navbar-item-text"/>
        </Tabs>
    );

};

export default Topnav;