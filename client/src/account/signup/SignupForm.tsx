import * as React from 'react';
import Spinner from '../../spinner/main';
import Button from '@material-ui/core/Button';

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
                <form className="account-form-container" onSubmit={props.onClickCreate}>
                    <input type="text" className="account-form underline top-md-padding" placeholder="Username" onChange={props.usernameChanged} />
                    <input type="email" className="account-form underline top-md-padding" placeholder="Email" onChange={props.emailChanged} />
                    <input type="password" className="account-form underline top-md-padding" placeholder="Password" onChange={props.passwordChanged} />
                    <Button variant="raised" className="account-form-create top-sm-padding" color="primary" onClick={props.onClickCreate}>
                        Create
                    </Button>
                    <Button variant="raised" className="account-form-back top-sm-padding" color="primary" onClick={props.onClickBack}>
                        Back
                    </Button>
                </form>
            </div>
        </div>
    );

};

export default SignupForm;