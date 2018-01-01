import * as React from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import Spinner from '../loader/spinner';
import * as common from '../../client-server-common/common';
import popupS from 'popups';
import * as AccountService from '../service/account/main';

class SignupForm extends React.Component {

    constructor(props){
        super(props);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.emailChanged = this.emailChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
        this.onClickBack = this.onClickBack.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            isLoading: false
        };
    }

    usernameChanged(event) {
        this.setState({username: event.target.value});
    }

    emailChanged(event) {
        this.setState({email: event.target.value});
    }

    passwordChanged(event) {
        this.setState({password: event.target.value});
    }

    onClickCreate(event){
        event.preventDefault();

        // validate
        const result = common.validateCredentials(this.state.username, this.state.password, this.state.email);
        if(result.error)
        {
            popupS.modal({ content: `<p>${result.errorMessage}</p>` });
            return;
        }
        
        // request signup
        this.setState({isLoading: true});
        AccountService.httpSignup(this.state.username, this.state.password, this.state.email)
            .then( (response) => {
                if(response.data.error){
                    this.setState({username: '', email: '', password: '', isLoading: false});
                    popupS.modal({ content: `<p>${response.data.message}</p>` });
                }
                else
                {
                    this.props.history.push('/account/login');
                }
            }, this)
            .catch( (error) => {
                if(error.response.status == 429)
                {
                    popupS.modal({ content: `<p>${error.response.statusText}</p>` });
                }
                else
                {
                    his.setState({username: '', email: '', password: '', isLoading: false});
                    popupS.modal({ content: `<p>${error}</p>` });
                }
            }, this);

    }

    onClickBack(){
        this.props.history.goBack();
    }

    render() {
        
        if(this.state.isLoading) 
        {
            return <Spinner loadingMsg="Creating account..." />;
        }

        return (
            <div>
                <div class="account-logo"/>
                <form class="account-form" onSubmit={this.onClickCreate}>
                    <input type="text" class="account-form" placeholder="Username" onChange={this.usernameChanged} />
                    <input type="email" class="account-form" placeholder="Email" onChange={this.emailChanged} />
                    <input type="password" class="account-form" placeholder="Password" onChange={this.passwordChanged} />
                    <button type="submit" class="account-form-create" ><i class="fa fa-user-plus" />Sign up</button>
                    <button type="button" class="account-form-back" onClick={this.onClickBack}><i class="fa fa-arrow-left" />Back</button>
                </form>
            </div>
        );
    }

}

SignupForm.propTypes = {
    history: PropTypes.object.isRequired
}

export default SignupForm;