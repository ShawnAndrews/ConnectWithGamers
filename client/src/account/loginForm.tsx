const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import { validateCredentials, GenericResponseModel } from '../../../client/client-server-common/common';
import * as AccountService from '../service/account/main';
import AccountIcons from './accountIcons';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

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

    remembermeChanged(event: any, isInputChecked: boolean) {
        this.setState({rememberme: isInputChecked});
    }

    onClickLogin(event: any) {
        event.preventDefault();
        
        // validate
        const error: string = validateCredentials(this.state.username, this.state.password);
        if (error) {
            popupS.modal({ content: `<div>• ${error}</div>` });
            return;
        }

        this.setState({isLoading: true});
        AccountService.httpLogin(this.state.username, this.state.password, this.state.rememberme)
            .then( () => {
                this.props.history.push('/');
            })
            .catch( (error: string) => {
                this.setState({ username: '', email: '', rememberme: false, isLoading: false });
                popupS.modal({ content:  `<div>• ${error}</div>` });
            });

    }

    onClickSignUp() {
        this.props.history.push('/account/signup');
    }

    render() {

        if (this.state.isLoading) {
            return (
                <div className="account-center">
                    <Spinner loadingMsg="Logging in..." />
                </div>
            );
        }

        return (
            <div>
                <div className="account-center">
                    <div className="account-logo"/>
                    <form className="account-form" onSubmit={this.onClickLogin}>
                        <input type="text" className="account-form underline top-md-padding" placeholder="Username" onChange={this.usernameChanged} />
                        <input type="password" className=" account-form underline top-md-padding" placeholder="Password" onChange={this.passwordChanged} />
                        <label className="account-form top-sm-padding">
                            <div className="div-center">
                                <Toggle
                                    className="account-checkbox large-checkbox"
                                    label="Remember me"
                                    onToggle={this.remembermeChanged}
                                />
                            </div>
                        </label>
                        <RaisedButton className="account-form-login top-sm-padding" label="Login" primary={true} onClick={this.onClickLogin}/>
                        <RaisedButton className="account-form-signup top-sm-padding" label="Sign Up" primary={true} onClick={this.onClickSignUp}/>
                    </form>
                </div>
                <AccountIcons/>
            </div>
        );
    }

}

export default withRouter(LoginForm);