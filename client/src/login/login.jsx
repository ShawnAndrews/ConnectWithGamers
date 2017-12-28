import * as React from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import store from '../redux/store/store';
import Spinner from '../loader/spinner';
import axios from 'axios';

import '../styles/loginForm';

class Login extends React.Component {


	constructor(props) {
        super(props);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);

        this.state = {
            username: '',
            password: '',
            isLoading: false
        };
	}

    usernameChanged(event) {
        this.setState({username: event.target.value});
    }

    passwordChanged(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if(this.state.username != '' && this.state.password != ''){
            console.log('Yes');
            this.setState({isLoading: true});
            axios.post('/account/login', {
                username: 'Fred',
                password: 'Flintstone'
              })
              .then( (response) => {
                console.log(response);
                this.props.history.push('/')
              }, this)
              .catch( (error) => {
                console.log(error);
                this.setState({isLoading: false});
              }, this);
            this.state.username = '';
            this.state.password = '';
        }else{
            console.log('No');
        }

    }

    render() {
        console.log("Login rendered with props ", this.props);
        console.log(this.props.store);

        return (
                <div class='login-page'>
                    <div class="center">
                        {this.state.isLoading
                            ? <Spinner loadingMsg="Logging in..." />
                            : <div>
                                <div class="login-logo"/>
                                <form class="login-form" onSubmit={this.handleSubmit.bind(this)}>
                                    <input type="text" class="login-form-username" placeholder="Username" onChange={this.usernameChanged} />
                                    <input type="password" class="login-form-password" placeholder="Password" onChange={this.passwordChanged} />
                                    <button type="submit" class="login-form-submit" ><i class="fa fa-sign-in" />Login</button>
                                    <button type="button" class="login-form-signup" ><i class="fa fa-user-o" />Sign Up</button>
                                </form>
                            </div>
                            }
                    </div>
                    <div class="login-icons">
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

Login.propTypes = {
    history: PropTypes.object.isRequired
}

export default withRouter(Login);