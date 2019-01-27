import * as React from 'react';
import { Route, Redirect, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import Account from '../account/main';
import { loggedIn } from '../service/account/main';
import ChatroomContainer from '../chat/mainContainer';
import GamesContainer from '../games/mainContainer';
import NotFoundPageContainer from '../notfound/NotFoundPageContainer';
import NavbarContainer from '../nav/NavbarContainer';
import RecoveryContainer from '../recovery/RecoveryFormContainer';

export enum NAV_PAGE {
    HOME = '/',
    SPECIALS = '/specials',
    ACCOUNT = '/account',
    CHATROOM = '/chat'
}

interface IAppProps extends RouteComponentProps<any> { }

interface IAppState {
    readonly authenticatedRoutes: string[];
    readonly unauthenticatedRedirect: string;
}

class App extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            authenticatedRoutes: ['/account', `/gaming`, `/gaming/twitch`, `/gaming/steam`, `/gaming/discord`],
            unauthenticatedRedirect: '/account/login'
        };
    }

    render() {
        const AuthorizedRoutesRedirect: JSX.Element[] = 
            this.state.authenticatedRoutes
                .filter(() => { return !loggedIn(); })
                .map((x: string) => (
                        <Route
                            key={x} 
                            exact={true}
                            path={x} 
                            render={() => (<Redirect to={this.state.unauthenticatedRedirect}/>)}
                        />
                    ));

        return (
            <div className="vh-min-100">
                <NavbarContainer/>
                <Switch>
                    {AuthorizedRoutesRedirect}
                    <Route path="/account" component={Account}/>
                    <Route path="/chat" component={ChatroomContainer}/>
                    <Route path="/recovery/:uid" component={RecoveryContainer}/>
                    <Route path="/" component={GamesContainer}/>
                    <Route component={NotFoundPageContainer}/>
                </Switch>
            </div>
        );

    }

}

export default withRouter(App);