import * as React from 'react';
import { Route, Redirect, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import Account from '../account/main';
import { loggedIn } from '../service/account/main';
import ChatroomMenu from '../chat/main';
import GamesContainer from '../games/main';
import NotFoundPageContainer from '../notfound/NotFoundPageContainer';
import NavbarContainer from '../nav/NavbarContainer';
import RecoveryContainer from '../recovery/RecoveryFormContainer';
import ShowcaseContainer from '../home/ShowcaseContainer';
import ModalFilternavContainer from '../games/modal/ModalFilternavContainer';
import Background from '../background/background';

export enum NAV_PAGE {
    HOME = '/',
    GAMES = '/games',
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
            authenticatedRoutes: ['/account', `/games/gaming`, `/games/gaming/twitch`, `/games/gaming/steam`, `/games/gaming/discord`],
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
            <div className="h-100">
                <Background/>
                <NavbarContainer/>
                <Switch>
                    {AuthorizedRoutesRedirect}
                    <Route path="/account" component={Account}/>
                    <Route path="/chat" component={ChatroomMenu}/>
                    <Route path="/games" component={GamesContainer}/>
                    <Route path="/recovery/:uid" component={RecoveryContainer}/>
                    <Route path="/" component={ShowcaseContainer}/>
                    <Route component={NotFoundPageContainer}/>
                </Switch>
                <ModalFilternavContainer/>
            </div>
        );

    }

}

export default withRouter(App);