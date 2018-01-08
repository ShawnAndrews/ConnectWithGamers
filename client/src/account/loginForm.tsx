const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import { validateCredentials, ResponseModel } from '../../../client/client-server-common/common';
import * as AccountService from '../service/account/main';

interface ILoginFormProps {
    history: any;
}

class LoginForm extends React.Component<ILoginFormProps, any> {

    constructor(props: ILoginFormProps) {
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

    usernameChanged(event: any) {
        this.setState({username: event.target.value});
    }

    passwordChanged(event: any) {
        this.setState({password: event.target.value});
    }

    remembermeChanged(event: any) {
        this.setState({rememberme: event.target.checked});
    }

    onClickLogin(event: any) {
        event.preventDefault();
        
        // validate
        const response: ResponseModel = validateCredentials(this.state.username, this.state.password);
        if (response.errors.length > 0) {
            const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
            popupS.modal({ content: formattedErrors.join('') });
            return;
        }

        this.setState({isLoading: true});
        AccountService.httpLogin(this.state.username, this.state.password, this.state.rememberme)
            .then( (response: ResponseModel) => {
                this.props.history.push('/');
            })
            .catch( (response: ResponseModel) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                this.setState({ username: '', email: '', rememberme: false, isLoading: false });
                popupS.modal({ content: formattedErrors.join('') });
            });

    }

    onClickSignUp() {
        this.props.history.push('/account/signup');
    }

    render() {

        if (this.state.isLoading) {
            return <Spinner loadingMsg="Logging in..." />;
        }

        return (
            <div>
                <div className="account-logo"/>
                <form className="account-form" onSubmit={this.onClickLogin}>
                    <input type="text" className="account-form underline" placeholder="Username" onChange={this.usernameChanged} />
                    <input type="password" className=" account-form underline" placeholder="Password" onChange={this.passwordChanged} />
                    <label className="account-form">
                        <div className="div-center">
                            <span className="account-rememberme">Remember me</span>
                            <input type="checkbox" onChange={this.remembermeChanged}/>
                        </div>
                    </label>
                    <button type="submit" className="account-form-login" ><i className="fa fa-sign-in" />Login</button>
                    <button type="button" className="account-form-signup" onClick={this.onClickSignUp} ><i className="fa fa-user-o" />Sign Up</button>
                </form>
            </div>
        );
    }

}

export default withRouter(LoginForm);