import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

interface ITopnavProps {
    index: number;
    goToTwitchPage: () => void;
    goToSteamPage: () => void;
    goToDiscordPage: () => void;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {

    return (
        <Tabs
            className="navbar-item-container fixed-container"
            value={props.index}
        >
            <Tab value={0} icon={<i className="fab fa-twitch fa-2x navbar-item-icon"/>} className="navbar-item-text" onActive={props.goToTwitchPage}/>
            <Tab value={1} icon={<i className="fab fa-steam-square fa-2x navbar-item-icon"/>} className="navbar-item-text" onActive={props.goToSteamPage}/>
            <Tab value={2} icon={<i className="fab fa-discord fa-2x navbar-item-icon"/>} className="navbar-item-text" onActive={props.goToDiscordPage}/>
        </Tabs>
    );

};

export default Topnav;