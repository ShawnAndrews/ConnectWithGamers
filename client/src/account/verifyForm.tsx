const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import { EmailVerifyResponse } from '../../../client/client-server-common/common';
import * as AccountService from '../service/account/main';
import RaisedButton from 'material-ui/RaisedButton';

interface IVerifyFormProps {
    history: any;
    match?: any;
}

class VerifyForm extends React.Component<IVerifyFormProps, any> {

    constructor(props: IVerifyFormProps) {
        super(props);
        this.loadSettings = this.loadSettings.bind(this);
        this.onVerifyEmailClick = this.onVerifyEmailClick.bind(this);

        this.state = { isLoading: true };
        this.loadSettings();
    }

    private loadSettings(): void {
        const verificationCode: string = this.props.match.params.id;
        AccountService.httpVerifyEmail(verificationCode)
            .then( (response: EmailVerifyResponse) => {
                const verificationSuccessful = response.data.verificationSuccessful;
                console.log(`Returned: ${verificationSuccessful}`);
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

    private onVerifyEmailClick(): void {
        if (this.state.verificationSuccessful) {
            this.props.history.push(`/account`);
        } else {
            this.props.history.push(`/`);
        }
    } 

    render() {
        
        if (this.state.isLoading) {
            return (
                <div className="account-center">
                    <Spinner loadingMsg="Verifying code..." />
                </div>
            );
        }

        return (
            <div className="account-verify-email-container">
                {this.state.verificationSuccessful
                ? <span className="account-verify-email-text">Successfully verified email!</span>
                : <span className="account-verify-email-text">Failed to verify email. <br/> Please ensure the verification code in the URL is correct.</span>}
                <RaisedButton className="account-verify-email-btn" label={this.state.verificationSuccessful ? "Back To Account" : "Home"} primary={true} onClick={this.onVerifyEmailClick}/>;
            </div>
        );
    }

}

export default withRouter(VerifyForm);