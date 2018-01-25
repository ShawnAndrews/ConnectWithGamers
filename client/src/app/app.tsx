import * as React from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Account from '../account/main';
import Background from '../background/background';
import NotFound from '../notfound/notfound';
import Notice from '../notice/notice';
import Navbar from '../navbar/navbar';

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
        console.log(`Is logged in? ${document.cookie.indexOf('login_token=')}`);
        return (document.cookie.indexOf('login_token=') !== -1);
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
                                            component={<Redirect to={this.state.unauthenticatedRedirect}/>}
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
                        <Navbar/>
                        <Switch>
                            {this.renderUnauthenticatedRedirects}
                            <Route path="/account" component={Account}/>
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