const popupS = require('popups');
import * as React from 'react';
import SignupForm from "./SignupForm";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { validateCredentials } from '../../../../client/client-server-common/common';
import * as AccountService from '../../service/account/main';

interface ISignupFormContainerProps extends RouteComponentProps<any> { }

interface ISignupFormContainerState {
    username: string;
    email: string;
    password: string;
    isLoading: boolean;
}

class SignupFormContainer extends React.Component<ISignupFormContainerProps, ISignupFormContainerState> {

    constructor(props: ISignupFormContainerProps) {
        super(props);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.emailChanged = this.emailChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
        this.onClickBack = this.onClickBack.bind(this);
        this.onClickHome = this.onClickHome.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.state = {
            username: '',
            email: '',
            password: '',
            isLoading: false
        };
    }

    usernameChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({username: event.target.value});
    }

    passwordChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({password: event.target.value});
    }

    emailChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({email: event.target.value});
    }

    onClickCreate(event?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) {
        if (event) {
            event.preventDefault();
        }

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

    onClickBack(event: React.MouseEvent<Element>): void {
        this.props.history.goBack();
    }

    onClickHome(event: React.MouseEvent<Element>): void {
        this.props.history.push('/');
    }

    onKeyPress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.onClickCreate();
        }
    }

    render() {
        return (
            <SignupForm 
                isLoading={this.state.isLoading}
                username={this.state.username}
                email={this.state.email}
                password={this.state.password}
                onClickCreate={this.onClickCreate}
                onClickBack={this.onClickBack}
                onClickHome={this.onClickHome}
                usernameChanged={this.usernameChanged}
                passwordChanged={this.passwordChanged}
                emailChanged={this.emailChanged}
                onKeyPress={this.onKeyPress}
            />
        );
    }

}

export default withRouter(SignupFormContainer);