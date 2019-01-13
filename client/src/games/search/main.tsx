import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import GameContainer from './game/GameContainer';
import NotFoundPageContainer from '../../notfound/NotFoundPageContainer';
import ResultsContainer from './filter/ResultsContainer';
import FullsizeResultsContainer from './filter/FullsizeResultsContainer';

const SearchRouter: React.SFC<any> = () => {

    return (
        <Switch>
            <Route path="/games/search/filter/:required?/:platforms?/:genres?/:categories?/:date?/:sort?" component={ResultsContainer}/>
            <Route path="/games/search/game/:id" component={GameContainer} />
            <Route path="/games/search/:type" component={FullsizeResultsContainer} />
            <Route path="/games/search" component={GameContainer} />
            <Route component={NotFoundPageContainer}/>
        </Switch>
    );

};

export default SearchRouter;