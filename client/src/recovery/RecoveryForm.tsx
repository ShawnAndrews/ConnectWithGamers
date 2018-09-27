import * as React from 'react';
import Spinner from './../spinner/main';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface IRecoveryFormProps {
    isLoading: boolean;
    uid: string;
    onPasswordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordConfirmChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRecoveryClick: () => void;
    onLoginClick: () => void;
    verifiedLink: boolean;
    successful: boolean;
}

const RecoveryForm: React.SFC<IRecoveryFormProps> = (props: IRecoveryFormProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="middle" loadingMsg="Loading..." />
        );
    }

    if (!props.verifiedLink) {
        return (
            <div className="account-recovery-page">
                <div className="account-recovery">
                    <div className="account-recovery-container">
                        <span className="account-recovery-title">Recovery link is invalid.</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-recovery-page">
            <div className="account-recovery">
                <div className="account-recovery-container">
                    <span className="account-recovery-title">{!props.successful ? 'Change password' : 'Successfully changed password!'}</span>
                    {!props.successful 
                    ?
                    <>
                        <TextField
                            className="account-recovery-password"
                            defaultValue=""
                            type="password"
                            onChange={props.onPasswordChanged}
                            label="New password"
                        />
                        <TextField
                            className="account-recovery-password"
                            defaultValue=""
                            type="password"
                            onChange={props.onPasswordConfirmChanged}
                            label="Confirm new password"
                        />
                        <Button 
                            variant="raised" 
                            className="account-recovery-btn"
                            color="primary" 
                            onClick={props.onRecoveryClick}
                        >
                            Confirm
                        </Button>
                    </>
                    :
                    <Button 
                        variant="raised" 
                        className="account-login-btn"
                        color="primary" 
                        onClick={props.onLoginClick}
                    >
                        Login
                    </Button>
                    }
                </div>
            </div>
        </div>
    );

};

export default RecoveryForm;