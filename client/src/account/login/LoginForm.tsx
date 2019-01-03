import * as React from 'react';
import Spinner from '../../spinner/main';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Paper, TextField, Checkbox } from '@material-ui/core';

interface ILoginFormProps {
    isLoading: boolean;
    username: string;
    password: string;
    rememberme: boolean;
    onClickLogin: (event: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>) => void;
    onClickNotAMember: React.MouseEventHandler<HTMLElement>;
    usernameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    passwordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    remembermeChanged: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    onKeyPress: (event: React.KeyboardEvent<Element>) => void;
}

const LoginForm: React.SFC<ILoginFormProps> = (props: ILoginFormProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center">
                <Spinner className="text-center mt-5" loadingMsg="Logging in..." />
            </div>
        );
    }

    return (
        <Paper className="account p-4 mx-auto mt-5" elevation={24}>
            <div className="logo-img text-center">
                <img src="https://i.imgur.com/UfeBmAp.gif"/>
            </div>
            <h3 className="logo-name font-secondary text-center mt-3">
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
                    <div className="col-6">
                        <FormControlLabel
                            className="rememberme m-0"
                            control={
                                <Checkbox
                                    checked={props.rememberme}
                                    onChange={props.remembermeChanged}
                                />
                            }
                            label="Remember me"
                        />
                    </div>
                    <div className="col-6">
                        <div className="d-table h-100 w-100">
                            <div className="notamember d-table-cell align-middle">
                                Not a member? <u onClick={props.onClickNotAMember}>Click here</u>
                            </div>
                        </div>
                    </div>
                </div>
                <Button className="login-btn mt-3" onClick={props.onClickLogin} variant="contained" color="primary" fullWidth={true}>
                    Login
                </Button>
            </form>
        </Paper>
    );

};

export default LoginForm;