import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Account from '../account/main';
import Background from '../background/background';
import NotFound from '../notfound/notfound';
import { withRouter } from 'react-router-dom';

interface IAppProps {
    history: any;
    dispatch: any;
}

class App extends React.Component<IAppProps, any> {

    constructor(props: IAppProps) {
        super(props);
        console.log('App props', this.props);
        this.authenticated = this.authenticated.bind(this);

        this.state = {
            loggedIn: false
        };
    }

    authenticated() {
        this.setState(
            {
                loggedIn: true
            }
        );
    }

    render() {
        console.log('App rendered with props ', this.props);

        // render
        return (
            <div>
                <Background/>
                <Switch>
                    <Route path="/account" component={Account} />
                    <Route component={NotFound}/>
                </Switch>
            </div>
        );

    }

}

export default withRouter(App);