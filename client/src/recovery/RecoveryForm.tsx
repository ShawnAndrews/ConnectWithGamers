import * as React from 'react';
import Spinner from './../spinner/main';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';

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
            <Spinner className="text-center mt-5" loadingMsg="Loading..." />
        );
    }

    if (!props.verifiedLink) {
        return (
            <Paper className="recovery bg-primary p-5 mx-auto mt-5 position-relative" elevation={24}>
                <h4 className="text-center color-secondary">Recovery link is invalid.</h4>
            </Paper>
        );
    }

    return (
        <Paper className="recovery bg-primary p-5 mx-auto mt-5 position-relative" elevation={24}>
            <h4 className="text-center color-secondary">{!props.successful ? 'Change password' : 'Successfully changed password!'}</h4>
            {!props.successful 
                ?
                <>
                    <TextField
                        className="custom-account-form-group mt-2"
                        defaultValue=""
                        type="password"
                        onChange={props.onPasswordChanged}
                        label="New password"
                        fullWidth={true}
                    />
                    <TextField
                        className="custom-account-form-group"
                        defaultValue=""
                        type="password"
                        onChange={props.onPasswordConfirmChanged}
                        label="Confirm new password"
                        fullWidth={true}
                    />
                    <Button 
                        variant="raised" 
                        className="color-primary bg-secondary mt-4"
                        color="primary" 
                        onClick={props.onRecoveryClick}
                        fullWidth={true}
                    >
                        Confirm
                    </Button>
                </>
                :
                <Button 
                    variant="raised" 
                    className="color-primary bg-secondary mt-4"
                    color="primary" 
                    onClick={props.onLoginClick}
                    fullWidth={true}
                >
                    Login
                </Button>
                }
        </Paper>
        // <div className="account-recovery-page">
        //     <div className="account-recovery">
        //         <div className="account-recovery-container">
        //             <span className="account-recovery-title">{!props.successful ? 'Change password' : 'Successfully changed password!'}</span>
        //             {!props.successful 
        //             ?
        //             <>
        //                 <TextField
        //                     className="account-recovery-password"
        //                     defaultValue=""
        //                     type="password"
        //                     onChange={props.onPasswordChanged}
        //                     label="New password"
        //                 />
        //                 <TextField
        //                     className="account-recovery-password"
        //                     defaultValue=""
        //                     type="password"
        //                     onChange={props.onPasswordConfirmChanged}
        //                     label="Confirm new password"
        //                 />
        //                 <Button 
        //                     variant="raised" 
        //                     className="account-recovery-btn"
        //                     color="primary" 
        //                     onClick={props.onRecoveryClick}
        //                 >
        //                     Confirm
        //                 </Button>
        //             </>
        //             :
        //             <Button 
        //                 variant="raised" 
        //                 className="account-login-btn"
        //                 color="primary" 
        //                 onClick={props.onLoginClick}
        //             >
        //                 Login
        //             </Button>
        //             }
        //         </div>
        //     </div>
        // </div>
    );

};

export default RecoveryForm;