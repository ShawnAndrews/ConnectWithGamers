import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginFormContainer from '../account/login/LoginFormContainer';
import SignupFormContainer from '../account/signup/SignupFormContainer';
import SettingsFormContainer from '../account/settings/SettingsFormsContainer';
import VerifyFormContainer from '../account//verify/verifyFormContainer';

const Account: React.SFC<any> = () => {

    return (
        <>
            <div className="account-background" />
            <div className="account mx-auto">
                <Switch>
                    <Route path="/account/login" component={LoginFormContainer}/>
                    <Route path="/account/signup" component={SignupFormContainer} />
                    <Route path="/account/verify/:id" component={VerifyFormContainer} />
                    <Route component={SettingsFormContainer} />
                </Switch>
            </div>
        </>
    );

};

export default Account;