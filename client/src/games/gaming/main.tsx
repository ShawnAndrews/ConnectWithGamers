import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePageContainer from '../gaming/home/HomePageContainer';
import TwitchListContainer from '../gaming/twitch/TwitchListContainer';
import SteamListContainer from '../gaming/steam/SteamListContainer';
import NotFoundPageContainer from '../../notfound/NotFoundPageContainer';
import TopnavContainer from './topnav/TopnavContainer';
import DiscordPageContainer from './discord/DiscordPageContainer';
import { Paper } from '@material-ui/core';

const Menu: React.SFC<any> = () => {

    return (
        <Paper className="gaming bg-primary-solid p-2 overflow-auto" elevation={24}>
            <TopnavContainer/>
            <div className="container">
                <Switch>
                    <Route exact={true} path="/games/gaming" component={HomePageContainer}/>
                    <Route exact={true} path="/games/gaming/twitch" component={TwitchListContainer}/>
                    <Route exact={true} path="/games/gaming/steam" component={SteamListContainer}/>
                    <Route exact={true} path="/games/gaming/discord" component={DiscordPageContainer}/>
                    <Route component={NotFoundPageContainer}/>
                </Switch>
            </div>
        </Paper>
    );

};

export default Menu;