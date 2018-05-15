import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePageContainer from '../gaming/home/HomePageContainer';
import TwitchListContainer from '../gaming/twitch/TwitchListContainer';
import SteamListContainer from '../gaming/steam/SteamListContainer';
import NotFoundPageContainer from '../../notfound/NotFoundPageContainer';
import TopnavContainer from './topnav/TopnavContainer';
import DiscordPageContainer from './discord/DiscordPageContainer';

const Menu: React.SFC<any> = () => {

    return (
        <div>
            <TopnavContainer/>
            <Switch>
                <Route exact={true} path="/menu/gaming" component={HomePageContainer}/>
                <Route exact={true} path="/menu/gaming/twitch" component={TwitchListContainer}/>
                <Route exact={true} path="/menu/gaming/steam" component={SteamListContainer}/>
                <Route exact={true} path="/menu/gaming/discord" component={DiscordPageContainer}/>
                <Route component={NotFoundPageContainer}/>
            </Switch>
        </div>
    );

};

export default Menu;