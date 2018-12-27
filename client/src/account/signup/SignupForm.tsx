import * as React from 'react';
import Spinner from '../../spinner/main';
import Button from '@material-ui/core/Button';
import { Paper, TextField } from '@material-ui/core';

interface ISignupFormProps {
    isLoading: boolean;
    username: string;
    email: string;
    password: string;
    onClickCreate: (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => void;
    onClickBack: React.MouseEventHandler<Element>;
    onClickHome: React.MouseEventHandler<Element>;
    usernameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    passwordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    emailChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<Element>) => void;
}

const SignupForm: React.SFC<ISignupFormProps> = (props: ISignupFormProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center">
                <Spinner loadingMsg="Creating account..." />
            </div>
        );
    }

    return (
        <Paper className="account bg-secondary-solid p-4 mx-auto mt-5" elevation={24}>
            <div className="logo-img text-center">
                <img src="https://i.imgur.com/UfeBmAp.gif"/>
            </div>
            <h3 className="logo-name color-primary font-secondary text-center mt-3">
                Connect With Gamers
            </h3>
            <form className="account-form" noValidate={true} autoComplete="off">
                <div className="username mx-auto">
                    <TextField
                        className="custom-account-form-group"
                        label="Username"
                        value={props.username}
                        onChange={props.usernameChanged}
                        onKeyPress={props.onKeyPress}
                        margin="normal"
                        fullWidth={true}
                    />
                </div>
                <div className="email mx-auto">
                    <TextField
                        className="custom-account-form-group mt-0"
                        label="Email address"
                        value={props.email}
                        onChange={props.emailChanged}
                        onKeyPress={props.onKeyPress}
                        margin="normal"
                        fullWidth={true}
                    />
                </div>
                <div className="password mx-auto">
                    <TextField
                        className="custom-account-form-group mt-0"
                        label="Password"
                        value={props.password}
                        onChange={props.passwordChanged}
                        onKeyPress={props.onKeyPress}
                        margin="normal"
                        type="password"
                        fullWidth={true}
                    />
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="d-table h-100 w-100">
                            <div className="alreadyamember d-table-cell align-middle text-center color-primary">
                                Already a member? <u onClick={props.onClickBack}>Click here</u>
                            </div>
                        </div>
                    </div>
                </div>
                <Button className="create-btn color-secondary bg-primary-solid hover-primary-solid mt-3" onClick={props.onClickCreate} variant="contained" color="primary" fullWidth={true}>
                    Create an account
                </Button>
            </form>
        </Paper>
    );

};

export default SignupForm;