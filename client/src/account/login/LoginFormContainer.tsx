const popupS = require('popups');
import * as React from 'react';
import LoginForm from "./LoginForm";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { validateCredentials } from '../../../../client/client-server-common/common';
import * as AccountService from '../../service/account/main';

interface ILoginFormContainerProps extends RouteComponentProps<any> { }

interface ILoginFormContainerState {
    username: string;
    password: string;
    email: string;
    rememberme: boolean;
    isLoading: boolean;
}

class LoginFormContainer extends React.Component<ILoginFormContainerProps, ILoginFormContainerState> {

    constructor(props: ILoginFormContainerProps) {
        super(props);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.remembermeChanged = this.remembermeChanged.bind(this);
        this.onClickLogin = this.onClickLogin.bind(this);
        this.onClickSignUp = this.onClickSignUp.bind(this);
        this.onClickHome = this.onClickHome.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.state = {
            username: '',
            password: '',
            email: undefined,
            rememberme: false,
            isLoading: false
        };
    }

    usernameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({username: event.target.value});
    }

    passwordChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: event.target.value});
    }

    remembermeChanged(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        this.setState({rememberme: checked});
    }
    
    onClickLogin(event?: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>): void {
        if (event) {
            event.preventDefault();   
        }
        
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
                this.setState({ email: '', rememberme: false, isLoading: false });
                popupS.modal({ 
                        content: `
                        <div>
                            <div>• ${error}</div>
                            <button class="email-recovery-btn" onclick=
                            "
                            var username = ${"'username=" + this.state.username + "'"};
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', '/account/email/recovery');
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            xhr.send(username);
                            this.parentNode.removeChild(this);
                            ">
                                Send password recovery email
                            </button>
                        </div>
                        `
                    });
            });

    }

    onClickSignUp(event: React.MouseEvent<HTMLElement>): void {
        this.props.history.push('/account/signup');
    }

    onClickHome(event: React.MouseEvent<HTMLElement>): void {
        this.props.history.push('/');
    }

    onKeyPress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.onClickLogin();
        }
    }

    render() {
        return (
            <LoginForm
                username={this.state.username}
                password={this.state.password}
                rememberme={this.state.rememberme}
                isLoading={this.state.isLoading}
                onClickLogin={this.onClickLogin}
                onClickSignUp={this.onClickSignUp}
                onClickHome={this.onClickHome}
                usernameChanged={this.usernameChanged}
                passwordChanged={this.passwordChanged}
                remembermeChanged={this.remembermeChanged}
                onKeyPress={this.onKeyPress}
            />
        );
    }

}

export default withRouter(LoginFormContainer);