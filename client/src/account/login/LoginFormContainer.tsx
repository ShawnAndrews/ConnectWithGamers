const popupS = require('popups');
import * as React from 'react';
import LoginForm from "./LoginForm";
import { withRouter } from 'react-router-dom';
import { validateCredentials, GenericResponseModel } from '../../../../client/client-server-common/common';
import * as AccountService from '../../service/account/main';

interface ILoginFormContainerProps {
    history: any;
}

class LoginFormContainer extends React.Component<ILoginFormContainerProps, any> {

    constructor(props: ILoginFormContainerProps) {
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
        return (
            <LoginForm 
                isLoading={this.state.isLoading}
                onClickLogin={this.onClickLogin}
                onClickSignUp={this.onClickSignUp}
                usernameChanged={this.usernameChanged}
                passwordChanged={this.passwordChanged}
                remembermeChanged={this.remembermeChanged}
            />
        );
    }

}

export default withRouter(LoginFormContainer);