const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../../spinner/main';
import FooterIcons from '../footer/footerIcons';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

interface IVerifyFormProps {
    isLoading: boolean;
    verificationSuccessful: boolean;
    onVerifyEmailClick: () => void;
}

const VerifyForm: React.SFC<IVerifyFormProps> = (props: IVerifyFormProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center">
                <Spinner loadingMsg="Verifying code..." />
            </div>
        );
    }

    return (
        <div className="account-verify-email-container">
            {props.verificationSuccessful
            ? <span className="account-verify-email-text">Successfully verified email!</span>
            : <span className="account-verify-email-text">Failed to verify email. <br/> Please ensure the verification code in the URL is correct.</span>}
            <RaisedButton className="account-verify-email-btn" label={props.verificationSuccessful ? "Back To Account" : "Home"} primary={true} onClick={props.onVerifyEmailClick}/>;
        </div>
    );

};

export default VerifyForm;