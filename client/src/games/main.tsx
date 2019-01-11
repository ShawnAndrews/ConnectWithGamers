import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import NewsPageContainer from '../home/news/page/NewsPageContainer';
import HomeContainer from './home/HomeContainer';
import SearchRouter from './search/main';
import NotFoundPageContainer from './../notfound/NotFoundPageContainer';
import GamingSwitch from './gaming/main';
import FilterContainer from './filter/FilterContainer';
import HamburgerContainer from './filter/hamburger/HamburgerContainer';

interface IMainProps {
    onHamburgerClick: () => void;
    filterExpanded: boolean;
}

const Main: React.SFC<IMainProps> = (props: IMainProps) => {

    return (
        <div className="games position-relative">
            <FilterContainer
                filterExpanded={props.filterExpanded}
            />
            <div className={`content d-inline-block overflow-hidden vh-min-100 p-4 ${props.filterExpanded ? 'active' : ''}`}>
                <Switch>
                    <Route path="/games/search" component={SearchRouter} />
                    <Route path="/games/news" component={NewsPageContainer} />
                    <Route path="/games/gaming" component={GamingSwitch} />
                    <Route path="/games" component={HomeContainer} />
                    <Route component={NotFoundPageContainer}/>
                </Switch>
            </div>
            <HamburgerContainer
                onHamburgerClick={props.onHamburgerClick}
                filterExpanded={props.filterExpanded}
            />
        </div>
    );

};

export default Main;