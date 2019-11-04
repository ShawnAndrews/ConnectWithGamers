import * as React from 'react';
import Spinner from '../../spinner/main';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

interface IVerifyFormProps {
    isLoading: boolean;
    verificationSuccessful: boolean;
    onVerifyEmailClick: () => void;
}

const VerifyForm: React.SFC<IVerifyFormProps> = (props: IVerifyFormProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center">
                <Spinner className="text-center mt-4" loadingMsg="Verifying code..." />
            </div>
        );
    }

    return (
        <div className="settings p-4 mx-auto mt-5 position-relative">
            {props.verificationSuccessful
                ? <div className="text-center color-tertiary">Successfully verified email!</div>
                : <div className="text-center color-tertiary">Failed to verify email. <br/> Please ensure the verification code in the URL is correct.</div>}
            <Button 
                variant="contained" 
                className="color-primary bg-tertiary mt-4"
                color="primary" 
                onClick={props.onVerifyEmailClick}
                fullWidth={true}
            >
                {props.verificationSuccessful ? "Back To Account" : "Home"} 
            </Button>
        </div>
    );

};

export default VerifyForm;