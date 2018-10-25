import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import SearchContainer from './home/SearchContainer';
import NotFoundPageContainer from '../../notfound/NotFoundPageContainer';
import ResultsContainer from './filter/ResultsContainer';

const SearchRouter: React.SFC<any> = () => {

    return (
        <Switch>
            <Route exact={true} path="/menu/search/:type(popular|upcoming|recent|news)" component={ResultsContainer}/>
            <Route exact={true} path="/menu/search/filter/:platforms?/:genres?/:categories?/:date?/:sort?" component={ResultsContainer}/>
            <Route exact={true} path="/menu/search/game/:id" component={SearchContainer} />
            <Route exact={true} path="/menu/search" component={SearchContainer} />
            <Route component={NotFoundPageContainer}/>
        </Switch>
    );

};

export default SearchRouter;