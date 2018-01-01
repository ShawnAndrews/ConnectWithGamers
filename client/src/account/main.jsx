import * as React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import store from '../redux/store/store';
import LoginForm from '../account/loginForm';
import SignupForm from '../account/signupForm';

import '../styles/account/main';
import '../styles/account/checkboxSwitch';
import '../styles/popupS';

class Account extends React.Component {


	constructor(props) {
        super(props);
	}

    render() {
        return (
                <div class='account-page'>
                    <div class="account-center">
                        <Switch>
                            <Route path='/account/login' component={LoginForm}/>
                            <Route path='/account/signup' component={SignupForm} />
                        </Switch>
                    </div>
                    <div class="account-icons">
                        <span><a href="https://twitter.com/ConnectWithGamers" target="_blank"><i class="fa fa-twitter fa-2x"></i></a></span>
                        <span><a href="https://github.com/ShawnAndrews/ConnectWithGamers" target="_blank"><i class="fa fa-github fa-2x"></i></a></span>
                        <span><a href="https://www.linkedin.com/in/shawnandrewsur/" target="_blank"><i class="fa fa-linkedin fa-2x"></i></a></span>
                        <span><a href="https://www.youtube.com/channel/UCLrdQcxsSZsYwY69uH9D0QA/videos" target="_blank"><i class="fa fa-youtube fa-2x"></i></a></span>
                        <span><a href="http://www.saportfolio.ca" target="_blank"><i class="fa fa-cloud fa-2x"></i></a></span>
                    </div>
                </div>
        );
    }

}

Account.propTypes = {
    history: PropTypes.object.isRequired
}

export default withRouter(Account);