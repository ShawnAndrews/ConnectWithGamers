const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import { validateCredentials, GenericResponseModel } from '../../../client/client-server-common/common';
import * as AccountService from '../service/account/main';
import AccountIcons from './accountIcons';

interface ISignupFormProps {
    history: any;
}

class SignupForm extends React.Component<ISignupFormProps, any> {

    constructor(props: ISignupFormProps) {
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

    usernameChanged(event: any) {
        this.setState({username: event.target.value});
    }

    emailChanged(event: any) {
        this.setState({email: event.target.value});
    }

    passwordChanged(event: any) {
        this.setState({password: event.target.value});
    }

    onClickCreate(event: any) {
        event.preventDefault();

        // validate
        const error: string = validateCredentials(this.state.username, this.state.password, this.state.email);
        if (error) {
            popupS.modal({ content: `<div>• ${error}</div>` });
            return;
        }
        
        // request signup
        this.setState({isLoading: true});
        AccountService.httpSignup(this.state.username, this.state.password, this.state.email)
            .then( () => {
                this.props.history.push('/account/login');
            })
            .catch( (error: string) => {
                this.setState({ username: '', email: '', password: '', isLoading: false });
                popupS.modal({ content: `<div>• ${error}</div>` });
            });

    }

    onClickBack() {
        this.props.history.goBack();
    }

    render() {
        
        if (this.state.isLoading) {
            return (
                <div className="account-center">
                    <Spinner loadingMsg="Creating account..." />
                </div>
            );
        }

        return (
            <div>
                <div className="account-center">
                    <div className="account-logo"/>
                    <form className="account-form" onSubmit={this.onClickCreate}>
                        <input type="text" className="account-form underline top-md-padding" placeholder="Username" onChange={this.usernameChanged} />
                        <input type="email" className="account-form underline top-md-padding" placeholder="Email" onChange={this.emailChanged} />
                        <input type="password" className="account-form underline top-md-padding" placeholder="Password" onChange={this.passwordChanged} />
                        <button type="submit" className="account-form-create top-sm-padding" ><i className="fas fa-user-plus" />&nbsp;Sign up</button>
                        <button type="button" className="account-form-back top-sm-padding" onClick={this.onClickBack}><i className="fas fa-arrow-left" />&nbsp;Back</button>
                    </form>
                </div>
                <AccountIcons/>
            </div>
        );
    }

}

export default withRouter(SignupForm);