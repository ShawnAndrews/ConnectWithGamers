import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import MenuListContainer from './list/MenuListContainer';
import SearchListContainer from './search/SearchListContainer';
import UpcomingGameListContainer from './upcoming/UpcomingGameListContainer';
import PlatformListContainer from './platform/PlatformListContainer';
import RecentGameListContainer from './recent/RecentGameListContainer';
import GenreListContainer from './genre/GenreListContainer';
import NotFoundPageContainer from '../notfound/NotFoundPageContainer';
import GamingSwitch from './gaming/main';

const Menu: React.SFC<any> = () => {

    return (
        <div className="menu">
            <Switch>
                <Route exact={true} path="/menu" component={MenuListContainer}/>
                <Route exact={true} path="/menu/search/:id" component={SearchListContainer} />
                <Route exact={true} path="/menu/search" component={SearchListContainer} />
                <Route exact={true} path="/menu/upcoming" component={UpcomingGameListContainer} />
                <Route exact={true} path="/menu/platform/:id" component={PlatformListContainer} />
                <Route exact={true} path="/menu/recent" component={RecentGameListContainer} />
                <Route exact={true} path="/menu/genre/:id" component={GenreListContainer} />
                <Route path="/menu/gaming" component={GamingSwitch} />
                <Route component={NotFoundPageContainer}/>
            </Switch>
        </div>
    );

};

export default Menu;