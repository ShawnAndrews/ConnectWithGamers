import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import LoginForm from '../account/loginForm';
import SignupForm from '../account/signupForm';

interface IAccountProps {
    history: any;
}

class Account extends React.Component<IAccountProps, any> {

    constructor(props: IAccountProps) {
        super(props);
    }

    render() {
        return (
                <div className="account-page">
                    <div className="account-center">
                        <Switch>
                            <Route path="/account/login" component={LoginForm}/>
                            <Route path="/account/signup" component={SignupForm} />
                        </Switch>
                    </div>
                    <div className="account-icons">
                        <span><a href="https://twitter.com/ConnectWithGamers" target="_blank"><i className="fa fa-twitter fa-2x"/></a></span>
                        <span><a href="https://github.com/ShawnAndrews/ConnectWithGamers" target="_blank"><i className="fa fa-github fa-2x"/></a></span>
                        <span><a href="https://www.linkedin.com/in/shawnandrewsur/" target="_blank"><i className="fa fa-linkedin fa-2x"/></a></span>
                        <span><a href="https://www.youtube.com/channel/UCLrdQcxsSZsYwY69uH9D0QA/videos" target="_blank"><i className="fa fa-youtube fa-2x"/></a></span>
                        <span><a href="http://www.saportfolio.ca" target="_blank"><i className="fa fa-cloud fa-2x"/></a></span>
                    </div>;
                </div>
        );
    }

}

export default withRouter(Account);