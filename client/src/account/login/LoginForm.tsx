const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../../spinner/main';
import FooterIcons from '../footer/footerIcons';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

interface ILoginFormProps {
    isLoading: boolean;
    onClickLogin: (event: any) => void;
    onClickSignUp: (event: any) => void;
    usernameChanged: (event: any) => void;
    passwordChanged: (event: any) => void;
    remembermeChanged: (event: any, isInputChecked: boolean) => void;
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
        <div>
            <div className="account-center">
                <div className="account-logo"/>
                <form className="account-form" onSubmit={props.onClickLogin}>
                    <input type="text" className="account-form underline top-md-padding" placeholder="Username" onChange={props.usernameChanged} />
                    <input type="password" className=" account-form underline top-md-padding" placeholder="Password" onChange={props.passwordChanged} />
                    <label className="account-form top-sm-padding">
                        <div className="div-center">
                            <Toggle
                                className="account-checkbox large-checkbox"
                                label="Remember me"
                                onToggle={props.remembermeChanged}
                            />
                        </div>
                    </label>
                    <RaisedButton className="account-form-login top-sm-padding" label="Login" primary={true} onClick={props.onClickLogin}/>
                    <RaisedButton className="account-form-signup top-sm-padding" label="Sign Up" primary={true} onClick={props.onClickSignUp}/>
                </form>
            </div>
            <FooterIcons/>
        </div>
    );

};

export default LoginForm;