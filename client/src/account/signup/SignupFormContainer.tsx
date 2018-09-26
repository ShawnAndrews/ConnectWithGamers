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

    passwordChanged(event: any) {
        this.setState({password: event.target.value});
    }

    emailChanged(event: any) {
        this.setState({email: event.target.value});
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

    onClickHome() {
        this.props.history.push('/');
    }

    render() {
        return (
            <SignupForm 
                isLoading={this.state.isLoading}
                onClickCreate={this.onClickCreate}
                onClickBack={this.onClickBack}
                onClickHome={this.onClickHome}
                usernameChanged={this.usernameChanged}
                passwordChanged={this.passwordChanged}
                emailChanged={this.emailChanged}
            />
        );
    }

}

export default withRouter(SignupFormContainer);