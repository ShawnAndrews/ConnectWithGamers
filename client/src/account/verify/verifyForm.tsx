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
        <Paper className="settings bg-secondary-color p-4 mx-auto mt-5 position-relative" elevation={24}>
            {props.verificationSuccessful
                ? <div className="text-center color-primary">Successfully verified email!</div>
                : <div className="text-center color-primary">Failed to verify email. <br/> Please ensure the verification code in the URL is correct.</div>}
            <Button 
                variant="raised" 
                className="color-secondary bg-primary-solid hover-primary-solid mt-4"
                color="primary" 
                onClick={props.onVerifyEmailClick}
                fullWidth={true}
            >
                {props.verificationSuccessful ? "Back To Account" : "Home"} 
            </Button>
        </Paper>
    );

};

export default VerifyForm;