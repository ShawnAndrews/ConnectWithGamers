import * as React from 'react';
import Spinner from '../../spinner/main';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface ILoginFormProps {
    isLoading: boolean;
    onClickLogin: (event: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>) => void;
    onClickSignUp: React.MouseEventHandler<HTMLElement>;
    onClickHome: React.MouseEventHandler<HTMLElement>;
    usernameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    passwordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    remembermeChanged: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const LoginForm: React.SFC<ILoginFormProps> = (props: ILoginFormProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center">
                <Spinner loadingMsg="Logging in..." />
            </div>
        );
    }

    return (
        <div className="flat-background">
            <div className="account-center">
                <a href="/"><div className="account-logo"/></a>
                <div className="account-logo-name">Connect With Gamers</div>
                <form className="account-form-container" onSubmit={props.onClickLogin}>
                    <input type="text" id="account-form-username" className="account-form underline top-md-padding" placeholder="Username" onChange={props.usernameChanged} />
                    <input type="password" className=" account-form underline top-md-padding" placeholder="Password" onChange={props.passwordChanged} />
                    <label className="account-form top-xs-padding">
                        <div className="div-center">
                            <FormControlLabel
                                className="account-form-rememberme"
                                control={
                                    <Switch
                                        className="account-checkbox large-checkbox"
                                        onChange={props.remembermeChanged}
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                        </div>
                    </label>
                    <Button 
                        variant="raised" 
                        className="account-form-login top-xs-padding"
                        color="primary" 
                        onClick={props.onClickLogin}
                    >
                        Login
                    </Button>
                    <Button 
                        variant="raised" 
                        className="account-form-signup top-sm-padding"
                        color="primary" 
                        onClick={props.onClickSignUp}
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
            <Button 
                variant="raised" 
                className="return-btn"
                color="primary" 
                onClick={props.onClickHome}
            >
                <i className="fas fa-2x fa-home"/>
            </Button>
        </div>
    );

};

export default LoginForm;