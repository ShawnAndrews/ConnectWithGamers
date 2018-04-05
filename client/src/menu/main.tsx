import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import MenuForm from './menuForm';
import SearchForm from './search/searchForm';
import UpcomingForm from './upcoming/upcomingForm';
import PlatformForm from './platform/platformForm';
import PlatformGameListForm from './platform/platformGameListForm';
import RecentForm from './recent/recentForm';
import GenreForm from './genre/genreForm';
import GenreGameListForm from './genre/genreGameListForm';

class Menu extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {

        return (
            <div className="menu">
                <Switch>
                    <Route exact={true} path="/menu" component={MenuForm}/>
                    <Route exact={true} path="/menu/search/:id" component={SearchForm} />
                    <Route exact={true} path="/menu/search" component={SearchForm} />
                    <Route exact={true} path="/menu/upcoming" component={UpcomingForm} />
                    <Route exact={true} path="/menu/platform/:id" component={PlatformGameListForm} />
                    <Route exact={true} path="/menu/platform" component={PlatformForm} />
                    <Route exact={true} path="/menu/recent" component={RecentForm} />
                    <Route exact={true} path="/menu/genre/:id" component={GenreGameListForm} />
                    <Route exact={true} path="/menu/genre" component={GenreForm} />
                </Switch>
            </div>
        );

    }

}

export default Menu;