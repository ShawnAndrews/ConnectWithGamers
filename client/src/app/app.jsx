import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from "../dashboard/dashboard";
import Login from "../login/login";
import Home from "../home/home";
import NotFound from "../notfound/notfound";
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import {HomeContainer} from "../redux/containers/homeContainer";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



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
            <MuiThemeProvider>
                <Dashboard loggedIn={this.state.loggedIn} authenticated={this.authenticated} />
                <Switch>
                    <Route exact path='/' component={HomeContainer}/>
                    <Route exact path='/login' render={() => <Login authenticated={this.authenticated}/>} />
                    <Route component={NotFound}/>
                </Switch>
            </MuiThemeProvider>
        );

    }

}

App.propTypes = {
    history: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
}

export default withRouter(App);