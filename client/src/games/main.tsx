import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import UpcomingGameListContainer from '../home/upcoming/UpcomingGameListContainer';
import RecentGameListContainer from '../home/recent/RecentGameListContainer';
import NewsPageContainer from '../home/news/page/NewsPageContainer';
import HomeContainer from './home/HomeContainer';
import SearchRouter from './search/main';
import NotFoundPageContainer from './../notfound/NotFoundPageContainer';
import GamingSwitch from './gaming/main';

const Menu: React.SFC<any> = () => {

    return (
        <Switch>
            <Route path="/games/search" component={SearchRouter} />
            <Route path="/games/upcoming" component={UpcomingGameListContainer} />
            <Route path="/games/recent" component={RecentGameListContainer} />
            <Route path="/games/news" component={NewsPageContainer} />
            <Route path="/games/gaming" component={GamingSwitch} />
            <Route path="/games" component={HomeContainer} />
            <Route component={NotFoundPageContainer}/>
        </Switch>
    );

};

export default Menu;