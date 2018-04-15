const popupS = require('popups');
import * as React from 'react';
import VerifyForm from "./VerifyForm";
import { withRouter } from 'react-router-dom';
import * as AccountService from '../../service/account/main';
import { EmailVerifyResponse } from '../../../../client/client-server-common/common';

interface IVerifyFormContainerProps {
    history: any;
    match?: any;
}

class VerifyFormContainer extends React.Component<IVerifyFormContainerProps, any> {

    constructor(props: IVerifyFormContainerProps) {
        super(props);
        this.loadSettings = this.loadSettings.bind(this);
        this.onVerifyEmailClick = this.onVerifyEmailClick.bind(this);

        this.state = { isLoading: true };
        this.loadSettings();
    }

    loadSettings(): void {
        const verificationCode: string = this.props.match.params.id;
        AccountService.httpVerifyEmail(verificationCode)
            .then( (response: EmailVerifyResponse) => {
                const verificationSuccessful = response.data.verificationSuccessful;
                this.setState({ 
                    isLoading: false, 
                    verificationSuccessful: verificationSuccessful});
            })
            .catch( (error: string) => {
                this.setState({ isLoading: false });
                this.props.history.push(`/`);
                popupS.modal({ content: `<div>• ${error}</div>` });
            });
    }

    onVerifyEmailClick(): void {
        if (this.state.verificationSuccessful) {
            this.props.history.push(`/account`);
        } else {
            this.props.history.push(`/`);
        }
    } 

    render() {
        return (
            <VerifyForm 
                isLoading={this.state.isLoading}
                verificationSuccessful={this.state.verificationSuccessful}
                onVerifyEmailClick={this.onVerifyEmailClick}
            />
        );
    }

}

export default withRouter(VerifyFormContainer);