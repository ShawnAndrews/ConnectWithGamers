import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from "../dashboard/dashboard";
import Login from "../login/login";
import Home from "../home/home";
import NotFound from "../notfound/notfound";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux"
import PropTypes from 'prop-types';

const mapStateToProps = state => {
    return {
        store: state
    }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//         onClick: () => {
//             dispatch(setVisibilityFilter(ownProps.filter))
//         }
//     }
// }


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

        // not authenticated
        if(!this.state.loggedIn){

            return (
                <div>
                    <Dashboard/>
                    <Redirect to="/login"/>
                    <Switch>
                        <Route exact path='/login' render={() => <Login authenticated={this.authenticated}/>} />} />
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            );

        }

        // authenticated
        return (
            <div>
                <Dashboard loggedIn={this.state.loggedIn} authenticated={this.authenticated} />
                <Redirect from="/login" to="/"/>
                <Switch>
                    <Route path='/' component={Home}/>
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

export default connect(mapStateToProps)(withRouter(App));
//export default withRouter(App);