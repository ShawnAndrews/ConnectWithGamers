import * as React from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import Spinner from '../loader/spinner';
import * as common from '../../client-server-common/common';
import popupS from 'popups';
import * as AccountService from '../service/account/main';

class LoginForm extends React.Component {

    constructor(props){
        super(props);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.remembermeChanged = this.remembermeChanged.bind(this);
        this.onClickLogin = this.onClickLogin.bind(this);
        this.onClickSignUp = this.onClickSignUp.bind(this);

        this.state = {
            username: '',
            password: '',
            rememberme: false,
            isLoading: false
        };
    }

    usernameChanged(event) {
        this.setState({username: event.target.value});
    }

    passwordChanged(event) {
        this.setState({password: event.target.value});
    }

    remembermeChanged(event) {
        this.setState({rememberme: event.target.checked});
    }

    onClickLogin(event) {
        event.preventDefault();
        
        // validate
        const result = common.validateCredentials(this.state.username, this.state.password);
        if(result.error)
        {
            popupS.modal({ content: `<p>${result.errorMessage}</p>` });
            return;
        }

        this.setState({isLoading: true});
        AccountService.httpLogin(this.state.username, this.state.password, this.state.rememberme)
            .then( (response) => {
                if(response.data){
                    this.setState({username: '', password: '', rememberme: false, isLoading: false});
                    popupS.modal({ content: `<p>${response.data}</p>` });
                }
                else
                {
                    this.props.history.push('/');
                }
            }, this)
            .catch( (error) => {
                popupS.modal({ content: `<p>${error}</p>` });
                this.setState({isLoading: false});
            }, this);

    }

    onClickSignUp() {
        this.props.history.push('/account/signup');
    }

    render() {

        if(this.state.isLoading) 
        {
            return <Spinner loadingMsg="Logging in..." />;
        }

        return (
            <div>
                <div class="account-logo"/>
                <form class="account-form" onSubmit={this.onClickLogin}>
                    <input type="text" class="account-form underline" placeholder="Username" onChange={this.usernameChanged} />
                    <input type="password" class=" account-form underline" placeholder="Password" onChange={this.passwordChanged} />
                    <label class="account-form">
                        <div class="div-center">
                            <span class="account-rememberme">Remember me</span>
                            <input type="checkbox" onChange={this.remembermeChanged}/>
                        </div>
                    </label>
                    <button type="submit" class="account-form-login" ><i class="fa fa-sign-in" />Login</button>
                    <button type="button" class="account-form-signup" onClick={this.onClickSignUp} ><i class="fa fa-user-o" />Sign Up</button>
                </form>
            </div>
        );
    }

}

LoginForm.propTypes = {
    history: PropTypes.object.isRequired
}

export default LoginForm;