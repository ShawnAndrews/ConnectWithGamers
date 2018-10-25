import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ShowcaseContainer from '../showcase/ShowcaseContainer';
import SearchRouter from '../search/main';
import UpcomingGameListContainer from '../upcoming/UpcomingGameListContainer';
import RecentGameListContainer from '../recent/RecentGameListContainer';
import NewsPageContainer from '../news/page/NewsPageContainer';
import NotFoundPageContainer from '../../notfound/NotFoundPageContainer';
import GamingSwitch from '../gaming/main';
import Swipeable = require('react-swipeable');
import FilternavContainer from '../filter/FilternavContainer';

interface ISwipeProps {
    isLoading: boolean;
    swipeableRef: React.RefObject<HTMLDivElement>;
    onSwipedLeft: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
    onSwipedRight: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
}

const Swipe: React.SFC<ISwipeProps> = (props: ISwipeProps) => {

    return (
        <>
            <Swipeable
                onSwipedLeft={props.onSwipedLeft}
                onSwipedRight={props.onSwipedRight}
                delta={0.0000000001}
                stopPropagation={true}
                trackMouse={true}
                className="inherit"
            >
                <div className="menu">
                    <FilternavContainer/>
                    <div className="swipeable scrollable" ref={props.swipeableRef}>
                        <Switch>
                            <Route exact={true} path="/menu" component={ShowcaseContainer} />
                            <Route path="/menu/search" component={SearchRouter} />
                            <Route exact={true} path="/menu/upcoming" component={UpcomingGameListContainer} />
                            <Route exact={true} path="/menu/recent" component={RecentGameListContainer} />
                            <Route exact={true} path="/menu/news" component={NewsPageContainer} />
                            <Route path="/menu/gaming" component={GamingSwitch} />
                            <Route component={NotFoundPageContainer}/>
                        </Switch>
                    </div>
                </div>
            </Swipeable>
        </>
    );

};

export default Swipe;