import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import NewsPageContainer from './showcase/news/page/NewsPageContainer';
import HomeContainer from './home/HomeContainer';
import SearchRouter from './search/main';
import NotFoundPageContainer from './../notfound/NotFoundPageContainer';
import SidenavContainer from './sidenav/SidenavContainer';
import { SidenavEnums } from '../../client-server-common/common';

interface IMainProps {
    onSidenavItemClick: (itemEnum: SidenavEnums) => void;
    sidebarActiveEnum: SidenavEnums;
}

const Main: React.SFC<IMainProps> = (props: IMainProps) => {

    return (
        <div className="games position-relative">
            <SidenavContainer
                onSidenavItemClick={props.onSidenavItemClick}
                sidebarActiveEnum={props.sidebarActiveEnum}
            />
            <div className={`content d-inline-block custom-scrollbar-slim px-5 pt-3 pb-0 mr-2 my-2 ${props.sidebarActiveEnum !== undefined ? 'active' : ''}`}>
                <Switch>
                    <Route path="/search" component={SearchRouter} />
                    <Route path="/news" component={NewsPageContainer} />
                    <Route path="/" component={HomeContainer} />
                    <Route component={NotFoundPageContainer}/>
                </Switch>
            </div>
        </div>
    );

};

export default Main;