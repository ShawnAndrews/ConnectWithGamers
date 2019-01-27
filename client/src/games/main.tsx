import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import NewsPageContainer from '../specials/news/page/NewsPageContainer';
import HomeContainer from './home/HomeContainer';
import SearchRouter from './search/main';
import NotFoundPageContainer from './../notfound/NotFoundPageContainer';
import GamingSwitch from './gaming/main';
import FilterContainer from './filter/FilterContainer';
import HamburgerContainer from './filter/hamburger/HamburgerContainer';
import Footer from '../footer/footer';
import MainContainer from '../specials/mainContainer';

interface IMainProps {
    onHamburgerClick: () => void;
    filterExpanded: boolean;
}

const Main: React.SFC<IMainProps> = (props: IMainProps) => {

    return (
        <>
            <div className="games position-relative">
                <FilterContainer
                    filterExpanded={props.filterExpanded}
                />
                <div className={`content d-inline-block overflow-hidden vh-min-100 p-4 ${props.filterExpanded ? 'active' : ''}`}>
                    <Switch>
                        <Route path="/specials" component={MainContainer} />
                        <Route path="/search" component={SearchRouter} />
                        <Route path="/news" component={NewsPageContainer} />
                        <Route path="/gaming" component={GamingSwitch} />
                        <Route path="/" component={HomeContainer} />
                        <Route component={NotFoundPageContainer}/>
                    </Switch>
                </div>
                <HamburgerContainer
                    onHamburgerClick={props.onHamburgerClick}
                    filterExpanded={props.filterExpanded}
                />
            </div>
            <Footer/>
        </>
    );

};

export default Main;