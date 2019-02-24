const popupS = require('popups');
import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import LoginForm from "./LoginForm";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { validateCredentials } from '../../../../client/client-server-common/common';
import * as AccountService from '../../service/account/main';
import { GlobalReduxState } from '../../reducers/main';
import { setLoggedIn } from '../../actions/main';

interface ILoginFormContainerProps extends RouteComponentProps<any> { }

interface ReduxStateProps {

}

interface ReduxDispatchProps {
    setLoggedIn: (loggedIn: boolean) => void;
}

type Props = ILoginFormContainerProps & ReduxStateProps & ReduxDispatchProps;

interface ILoginFormContainerState {
    username: string;
    password: string;
    email: string;
    rememberme: boolean;
    isLoading: boolean;
}

class LoginFormContainer extends React.Component<Props, ILoginFormContainerState> {

    constructor(props: Props) {
        super(props);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
        this.remembermeChanged = this.remembermeChanged.bind(this);
        this.onClickLogin = this.onClickLogin.bind(this);
        this.onClickIGDB = this.onClickIGDB.bind(this);
        this.onClickNotAMember = this.onClickNotAMember.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onIGDBAuthenticate = this.onIGDBAuthenticate.bind(this);
        
        const attemptingIGDBLogin: boolean = this.props.history.location.search !== "";

        if (attemptingIGDBLogin) {
            const igdbAuthCode: string = this.props.history.location.search.substr(this.props.history.location.search.indexOf(`code=`) + 5)
            this.onIGDBAuthenticate(igdbAuthCode);
        }

        this.state = {
            username: '',
            password: '',
            email: undefined,
            rememberme: false,
            isLoading: attemptingIGDBLogin
        };
    }

    usernameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({username: event.target.value});
    }

    passwordChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: event.target.value});
    }

    remembermeChanged(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
        this.setState({rememberme: checked});
    }
    
    onIGDBAuthenticate(igdbAuthCode: string): void {
        AccountService.httpIGDBLogin(igdbAuthCode)
            .then( () => {
                this.props.history.push('/account');
                this.props.setLoggedIn(true);
            })
            .catch( (error: string) => {
                this.setState({ email: '', rememberme: false, isLoading: false });
                popupS.modal({ content: `Failed to authorize IGDB login. ${error}` });
            });
    }

    onClickLogin(event?: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>): void {
        if (event) {
            event.preventDefault();   
        }
        
        // validate
        const error: string = validateCredentials(this.state.username, this.state.password);
        if (error) {
            popupS.modal({ content: `<div>• ${error}</div>` });
            return;
        }

        this.setState({isLoading: true});
        AccountService.httpLogin(this.state.username, this.state.password, this.state.rememberme)
            .then( () => {
                this.props.setLoggedIn(true);
                this.props.history.push('/account');
            })
            .catch( (error: string) => {
                this.setState({ email: '', rememberme: false, isLoading: false });
                popupS.modal({ 
                        content: `
                        <div>
                            <div>• ${error}</div>
                            <button class="email-recovery-btn" onclick=
                            "
                            var username = ${"'username=" + this.state.username + "'"};
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', '/account/email/recovery');
                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            xhr.send(username);
                            this.parentNode.removeChild(this);
                            ">
                                Send password recovery email
                            </button>
                        </div>
                        `
                    });
            });

    }

    onClickIGDB(event?: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>): void {
        this.props.history.push('https://www.igdb.com/oauth/authorize?client_id=422b90f896025d511c612a77a64b3bed34ea71d8509f1b314ca2e982bd6d9624&redirect_uri=http%3A%2F%2Flocalhost/igdb/callback&scope=read_user&response_type=code');
    }

    onClickNotAMember(event: React.MouseEvent<HTMLElement>): void {
        this.props.history.push('/account/signup');
    }

    onKeyPress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.onClickLogin();
        }
    }

    render() {
        return (
            <LoginForm
                username={this.state.username}
                password={this.state.password}
                rememberme={this.state.rememberme}
                isLoading={this.state.isLoading}
                onClickLogin={this.onClickLogin}
                onClickIGDB={this.onClickIGDB}
                onClickNotAMember={this.onClickNotAMember}
                usernameChanged={this.usernameChanged}
                passwordChanged={this.passwordChanged}
                remembermeChanged={this.remembermeChanged}
                onKeyPress={this.onKeyPress}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: ILoginFormContainerProps): ReduxStateProps => ({})

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ILoginFormContainerProps): ReduxDispatchProps => ({
    setLoggedIn: (loggedIn: boolean) => { dispatch(setLoggedIn(loggedIn)); },
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ILoginFormContainerProps>
    (mapStateToProps, mapDispatchToProps)(LoginFormContainer));