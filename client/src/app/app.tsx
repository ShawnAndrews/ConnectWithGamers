import * as React from 'react';
import { Route, Redirect, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import Account from '../account/main';
import { loggedIn } from '../service/account/main';
import HomePageContainer from '../home/HomePageContainer';
import Menu from '../menu/main';
import ChatroomMenuContainer from '../chat/ChatroomMenuContainer';
import Background from '../background/background';
import NotFoundPageContainer from '../notfound/NotFoundPageContainer';
import NavbarContainer from '../nav/NavbarContainer';
import RecoveryContainer from '../recovery/RecoveryFormContainer';

export enum NAV_PAGE {
    HOME = '/',
    MENU = '/menu',
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
            authenticatedRoutes: ['/account', `/menu/gaming`, `/menu/gaming/twitch`, `/menu/gaming/steam`, `/menu/gaming/discord`],
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
            <>
                <Background/>
                <NavbarContainer/>
                <Switch>
                    {AuthorizedRoutesRedirect}
                    <Route path="/account" component={Account}/>
                    <Route path="/menu" component={Menu}/>
                    <Route path="/chat" component={ChatroomMenuContainer}/>
                    <Route path="/recovery/:uid" component={RecoveryContainer}/>
                    <Route exact={true} path="/" component={HomePageContainer}/>
                    <Route component={NotFoundPageContainer}/>
                </Switch>
            </>
        );

    }

}

export default withRouter(App);