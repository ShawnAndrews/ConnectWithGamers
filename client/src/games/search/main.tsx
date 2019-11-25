import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import GameContainer from './game/GameContainer';
import NotFoundPageContainer from '../../notfound/NotFoundPageContainer';
import ResultsContainer from './filter/ResultsContainer';
import HomeMenuContainer from '../home/menu/HomeMenuContainer';

const SearchRouter: React.SFC<any> = () => {

    return (
        <Switch>
            <Route path="/search/filter/:platforms?/:genres?/:price?/:date?/:sort?" component={ResultsContainer}/>
            <Route path="/search/game/:id" component={GameContainer} />
            <Route path="/search" component={HomeMenuContainer} />
            <Route exact path="/search" render={() => <Redirect to="/search/filter"/>} />
            <Route component={NotFoundPageContainer}/>
        </Switch>
    );

};

export default SearchRouter;