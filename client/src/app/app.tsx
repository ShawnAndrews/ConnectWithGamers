import * as React from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Account from '../account/main';
import Home from '../home/home';
import Menu from '../menu/main';
import ChatroomMenu from '../chatroom/chatroommenu';
import Background from '../background/background';
import NotFound from '../notfound/notfound';
import Notice from '../notice/notice';
import Navbar from '../navbar/navbar';
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
            authenticatedRoutes: ['/account', '/chat', `/chat/users`],
            unauthenticatedRedirect: '/account/login'
        };
    }

    private get isMobileBrowser(): boolean {
        return (window.innerWidth <= 800 && window.innerHeight <= 1000);
    }

    private get loggedIn(): boolean {
        return (document.cookie.indexOf(`${AUTH_TOKEN_NAME}=`) !== -1);
    }

    private get renderUnauthenticatedRedirects(): JSX.Element[] {
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

        // render
        return (
            <div className="inherit">
                <Background/>
                {this.isMobileBrowser 
                    ?
                    <div className="inherit">
                        <Navbar/>
                        <Switch>
                            {this.renderUnauthenticatedRedirects}
                            <Route path="/account" component={Account}/>
                            <Route path="/menu" component={Menu}/>
                            <Route path="/chat" component={ChatroomMenu}/>
                            <Route exact={true} path="/" component={Home}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                    :
                    <Notice message="Sorry! This application is only available on mobile devices."/>
                    }
                
            </div>
        );

    }

}

export default withRouter(App);