const popupS = require('popups');
import * as React from 'react';
import RecoveryForm from "./RecoveryForm";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as AccountService from './../service/account/main';
import { validatePassword, RecoverPasswordResponse, EmailRecoveryVerifyResponse } from '../../client-server-common/common';

interface IRecoveryFormContainerProps extends RouteComponentProps<any> { }

interface IRecoveryFormContainerState {
    isLoading: boolean;
    uid: string;
    password: string;
    passwordConfirm: string;
    verifiedLink: boolean;
    successful: boolean;
}

class RecoveryFormContainer extends React.Component<IRecoveryFormContainerProps, IRecoveryFormContainerState> {

    constructor(props: IRecoveryFormContainerProps) {
        super(props);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onPasswordConfirmChanged = this.onPasswordConfirmChanged.bind(this);
        this.onRecoveryClick = this.onRecoveryClick.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        
        this.state = {
            isLoading: true,
            uid: this.props.match.params.uid,
            password: undefined,
            passwordConfirm: undefined,
            verifiedLink: undefined,
            successful: false
        };
    }

    componentDidMount(): void {
        AccountService.httpVerifyRecoveryLink(this.state.uid)
            .then( (response: EmailRecoveryVerifyResponse) => {
                this.setState({ isLoading: false, verifiedLink: response.verifiedLink });
            })
            .catch( (error: string) => {
                this.setState({ isLoading: false });
                popupS.modal({ content: `<div>• ${error}</div>` });
            });
    }

    onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ password: event.currentTarget.value });
    }

    onPasswordConfirmChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ passwordConfirm: event.currentTarget.value });
    } 

    onRecoveryClick(): void {

        // confirm password matches
        if (this.state.password !== this.state.passwordConfirm || validatePassword(this.state.password) !== undefined) {
            popupS.modal({ content: `<div>• Passwords do not match.</div>` });
            return;
        }
        
        this.setState({ isLoading: true }, () => {
            AccountService.httpRecoverPassword(this.state.password, this.state.uid)
                .then( (response: RecoverPasswordResponse) => {
                    this.setState({ isLoading: false, successful: true });
                })
                .catch( (error: string) => {
                    this.setState({ isLoading: false });
                    this.props.history.push(`/`);
                    popupS.modal({ content: `<div>• ${error}</div>` });
                });
        });

    }

    onLoginClick(): void {
        this.props.history.push(`/account`);
    }

    render() {
        return (
            <RecoveryForm 
                isLoading={this.state.isLoading}
                uid={this.state.uid}
                onPasswordChanged={this.onPasswordChanged}
                onPasswordConfirmChanged={this.onPasswordConfirmChanged}
                onRecoveryClick={this.onRecoveryClick}
                onLoginClick={this.onLoginClick}
                verifiedLink={this.state.verifiedLink}
                successful={this.state.successful}
            />
        );
    }

}

export default withRouter(RecoveryFormContainer);