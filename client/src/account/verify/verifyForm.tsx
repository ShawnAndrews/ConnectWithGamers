import * as React from 'react';
import Spinner from '../../spinner/main';
import Button from '@material-ui/core/Button';

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
            <Button 
                variant="raised" 
                className="account-verify-email-btn" 
                value={props.verificationSuccessful ? "Back To Account" : "Home"} 
                color="primary" 
                onClick={props.onVerifyEmailClick}
            />;
        </div>
    );

};

export default VerifyForm;