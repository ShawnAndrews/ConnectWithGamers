import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from "../dashboard/dashboard";
import Account from "../account/main";
import Signup from "../signup/signup";
import Background from '../background/background';
import NotFound from "../notfound/notfound";
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import {HomeContainer} from "../redux/containers/homeContainer";


class App extends React.Component {

    constructor(props){
        super(props);
        console.log("App props", this.props);
        this.authenticated = this.authenticated.bind(this);

        this.state = {
            loggedIn: false
        };
    }

    authenticated(){
        this.setState(
            {
                loggedIn: true
            }
        );
    }

    render() {
        console.log("App rendered with props ", this.props);

        // render
        return (
            <div>
                <Background/>
                <Switch>
                    <Route exact path='/' component={HomeContainer}/>
                    <Route path='/account' component={Account} />
                    <Route component={NotFound}/>
                </Switch>
            </div>
        );

    }

}

App.propTypes = {
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
}

export default withRouter(App);