const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../../spinner/main';
import FooterIcons from '../footer/footerIcons';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

interface ISignupFormProps {
    isLoading: boolean;
    onClickCreate: (event: any) => void;
    onClickBack: (event: any) => void;
    usernameChanged: (event: any) => void;
    passwordChanged: (event: any) => void;
    emailChanged: (event: any) => void;
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
        <div>
            <div className="account-center">
                <a href="/"><div className="account-logo"/></a>
                <form className="account-form" onSubmit={props.onClickCreate}>
                    <input type="text" className="account-form underline top-md-padding" placeholder="Username" onChange={props.usernameChanged} />
                    <input type="email" className="account-form underline top-md-padding" placeholder="Email" onChange={props.emailChanged} />
                    <input type="password" className="account-form underline top-md-padding" placeholder="Password" onChange={props.passwordChanged} />
                    <RaisedButton className="account-form-create top-sm-padding" label="Create" primary={true} onClick={props.onClickCreate}/>
                    <RaisedButton className="account-form-back top-sm-padding" label="Back" primary={true} onClick={props.onClickBack}/>
                </form>
            </div>
        </div>
    );

};

export default SignupForm;