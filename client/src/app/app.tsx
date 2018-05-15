import * as React from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Account from '../account/main';
import HomePageContainer from '../home/HomePageContainer';
import Menu from '../menu/main';
import ChatroomMenuContainer from '../chat/ChatroomMenuContainer';
import Background from '../background/background';
import NotFoundPageContainer from '../notfound/NotFoundPageContainer';
import NoticePage from '../notice/NoticePage';
import NavbarContainer from '../nav/NavbarContainer';
import { AUTH_TOKEN_NAME } from '../../client-server-common/common';

export enum NAV_PAGE {
    HOME = '/',
    MENU = '/menu',
    ACCOUNT = '/account',
    CHATROOM = '/chat'
}

interface IAppProps {
    history: any;
    dispatch: any;
}

class App extends React.Component<IAppProps, any> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            authenticatedRoutes: ['/account', '/chat', `/chat/users`, `/menu/gaming`, `/menu/gaming/twitch`, `/menu/gaming/steam`, `/menu/gaming/discord`],
            unauthenticatedRedirect: '/account/login'
        };
    }

    get isMobileBrowser(): boolean {
        return (window.innerWidth <= 800 && window.innerHeight <= 1000);
    }

    get loggedIn(): boolean {
        return (document.cookie.indexOf(`${AUTH_TOKEN_NAME}=`) !== -1);
    }

    get renderUnauthenticatedRedirects(): JSX.Element[] {
        if (!this.loggedIn) {
            return (
                this.state.authenticatedRoutes
                                .map((x: string) => 
                                     (
                                        <Route
                                            key={x} 
                                            exact={true}
                                            path={x} 
                                            render={() => (<Redirect to={this.state.unauthenticatedRedirect}/>)}
                                        />
                                    )
                                )
            );
        }
        return [];
    }

    render() {

        return (
            <div className="inherit">
                <Background/>
                {this.isMobileBrowser 
                    ?
                    <div className="inherit">
                        <NavbarContainer/>
                        <Switch>
                            {this.renderUnauthenticatedRedirects}
                            <Route path="/account" component={Account}/>
                            <Route path="/menu" component={Menu}/>
                            <Route path="/chat" component={ChatroomMenuContainer}/>
                            <Route exact={true} path="/" component={HomePageContainer}/>
                            <Route component={NotFoundPageContainer}/>
                        </Switch>
                    </div>
                    :
                    <NoticePage message="Sorry! This application is only available on mobile devices."/>
                    }
                
            </div>
        );

    }

}

export default withRouter(App);