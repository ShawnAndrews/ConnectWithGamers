import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

class AccountIcons extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="account-icons">
                <span className="account-icon"><a href="https://twitter.com/ConnectWithGamers" target="_blank"><i className="fab fa-twitter fa-2x"/></a></span>
                <span className="account-icon"><a href="https://github.com/ShawnAndrews/ConnectWithGamers" target="_blank"><i className="fab fa-github fa-2x"/></a></span>
                <span className="account-icon"><a href="https://www.linkedin.com/in/shawnandrewsur/" target="_blank"><i className="fab fa-linkedin fa-2x"/></a></span>
                <span className="account-icon"><a href="https://www.youtube.com/channel/UCLrdQcxsSZsYwY69uH9D0QA/videos" target="_blank"><i className="fab fa-youtube fa-2x"/></a></span>
                <span className="account-icon"><a href="http://www.saportfolio.ca" target="_blank"><i className="fas fa-cloud fa-2x"/></a></span>
            </div>
        );
    }

}

export default AccountIcons;