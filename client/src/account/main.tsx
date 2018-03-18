import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginForm from '../account/loginForm';
import SignupForm from '../account/signupForm';
import SettingsForm from '../account/settingsForm';

class Account extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="account-page">
                <Switch>
                    <Route path="/account/login" component={LoginForm}/>
                    <Route path="/account/signup" component={SignupForm} />
                    <Route component={SettingsForm} />
                </Switch>
            </div>
        );
    }

}

export default Account;