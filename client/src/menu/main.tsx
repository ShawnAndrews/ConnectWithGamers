import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import MenuForm from './menuForm';
import SearchForm from './search/searchForm';
import UpcomingForm from './upcoming/upcomingForm';

interface IMenuProps {
    history: any;
}

class Menu extends React.Component<IMenuProps, any> {

    constructor(props: IMenuProps) {
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
                </Switch>
            </div>
        );

    }

}

export default withRouter(Menu);