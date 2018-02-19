import * as React from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Account from '../account/main';
import Background from '../background/background';
import NotFound from '../notfound/notfound';
import Notice from '../notice/notice';
import Navbar from '../navbar/navbar';
import Home from '../home/home';
import Menu from '../menu/main';

export enum NAV_PAGE {
    HOME = '/',
    MENU = '/menu',
    ACCOUNT = '/account'
}

interface IAppProps {
    history: any;
    dispatch: any;
}

class App extends React.Component<IAppProps, any> {

    constructor(props: IAppProps) {
        super(props);
        console.log('App props', this.props);

        this.state = {
            authenticatedRoutes: ['/account'],
            unauthenticatedRedirect: '/account/login'
        };
    }

    private get isMobileBrowser(): boolean {
        return (window.innerWidth <= 800 && window.innerHeight <= 1000);
    }

    private get loggedIn(): boolean {
        return (document.cookie.indexOf('loginToken=') !== -1);
    }

    private get currentNavPage(): NAV_PAGE {
        console.log(this.props.history);
        const path: string = this.props.history.location.pathname;
        if (path.startsWith(NAV_PAGE.ACCOUNT)) {
            return NAV_PAGE.ACCOUNT;
        } else if (path.startsWith(NAV_PAGE.MENU)) {
            return NAV_PAGE.MENU;
        } else {
            return NAV_PAGE.HOME;
        }
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
        console.log('App rendered with props ', this.props);

        // render
        return (
            <div>
                <Background/>
                {this.isMobileBrowser 
                    ?
                    <div>
                        <Navbar page={this.currentNavPage}/>
                        <Switch>
                            {this.renderUnauthenticatedRedirects}
                            <Route path="/account" component={Account}/>
                            <Route path="/menu" component={Menu}/>
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