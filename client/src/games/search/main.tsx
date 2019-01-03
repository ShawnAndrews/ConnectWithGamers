import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import GameContainer from './game/GameContainer';
import NotFoundPageContainer from '../../notfound/NotFoundPageContainer';
import ResultsContainer from './filter/ResultsContainer';

const SearchRouter: React.SFC<any> = () => {

    return (
        <Switch>
            <Route exact={true} path="/games/:type(popular|upcoming|recent|news)" component={ResultsContainer}/>
            <Route exact={true} path="/games/search/filter/:platforms?/:genres?/:categories?/:date?/:sort?" component={ResultsContainer}/>
            <Route exact={true} path="/games/search/game/:id" component={GameContainer} />
            <Route exact={true} path="/games/search" component={GameContainer} />
            <Route component={NotFoundPageContainer}/>
        </Switch>
    );

};

export default SearchRouter;