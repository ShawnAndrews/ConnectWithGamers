const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import * as AccountService from '../service/account/main';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { ResponseModel } from '../../client-server-common/common';

interface ISettingsFormProps {
    history: any;
}

class SettingsForm extends React.Component<ISettingsFormProps, any> {

    constructor(props: ISettingsFormProps) {
        super(props);
        this.loadSettings = this.loadSettings.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changeDiscord = this.changeDiscord.bind(this);
        this.changeSteam = this.changeSteam.bind(this);
        this.changeTwitch = this.changeTwitch.bind(this);
        this.onUsernameChanged = this.onUsernameChanged.bind(this);
        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.onDiscordChanged = this.onDiscordChanged.bind(this);
        this.onSteamChanged = this.onSteamChanged.bind(this);
        this.onTwitchChanged = this.onTwitchChanged.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            isLoading: true,
            loadingMsg: `Loading account settings...`
        };
        this.loadSettings();
    }

    private loadSettings(): void {
        AccountService.httpAccountSettings()
            .then( (response: ResponseModel) => {
                const username = response.data.username;
                const email = response.data.email;
                const discord = response.data.discord;
                const steam = response.data.steam;
                const twitch = response.data.twitch;
                this.setState({ 
                    isLoading: false, 
                    username: username, 
                    email: email,
                    discord: discord,
                    steam: steam,
                    twitch: twitch,
                    newUsername: username, 
                    newEmail: email,
                    newDiscord: discord,
                    newSteam: steam,
                    newTwitch: twitch});
            })
            .catch( (response: ResponseModel) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                this.setState({ isLoading: false });
                popupS.modal({ content: formattedErrors.join('') });
                this.props.history.push(`/`);
            });
    }

    private changeUsername(): void {
        this.setState({ isLoading: true, loadingMsg: `Changing username...` }, () => {
            AccountService.httpChangeAccountUsername(this.state.newUsername)
                .then( () => {
                    this.setState({ isLoading: false, username: this.state.newUsername });
                })
                .catch( (response: ResponseModel) => {
                    const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                    this.setState({ isLoading: false });
                    popupS.modal({ content: formattedErrors.join('') });
                });
        });
    }

    private changeEmail(): void {
        this.setState({ isLoading: true, loadingMsg: `Changing email...` }, () => {
            AccountService.httpChangeAccountEmail(this.state.newEmail)
                .then( () => {
                    this.setState({ isLoading: false, email: this.state.newEmail });
                })
                .catch( (response: ResponseModel) => {
                    const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                    this.setState({ isLoading: false });
                    popupS.modal({ content: formattedErrors.join('') });
                });
        });
    }
    private changeDiscord(): void {
        this.setState({ isLoading: true, loadingMsg: `Changing discord link...` }, () => {
            AccountService.httpChangeAccountDiscord(this.state.newDiscord)
                .then( () => {
                    this.setState({ isLoading: false, discord: this.state.newDiscord });
                })
                .catch( (error: string) => {
                    this.setState({ isLoading: false });
                    popupS.modal({ content: error });
                });
        });
    }

    private changeSteam(): void {
        this.setState({ isLoading: true, loadingMsg: `Changing steam link...` }, () => {
            AccountService.httpChangeAccountSteam(this.state.newSteam)
                .then( () => {
                    this.setState({ isLoading: false, steam: this.state.newSteam });
                })
                .catch( (error: string) => {
                    this.setState({ isLoading: false });
                    popupS.modal({ content: error });
                });
        });
    }

    private changeTwitch(): void {
        this.setState({ isLoading: true, loadingMsg: `Changing twitch link...` }, () => {
            AccountService.httpChangeAccountTwitch(this.state.newTwitch)
                .then( () => {
                    this.setState({ isLoading: false, twitch: this.state.newTwitch });
                })
                .catch( (error: string) => {
                    this.setState({ isLoading: false });
                    popupS.modal({ content: error });
                });
        });
    }
    private onUsernameChanged(event: object, newUsername: string): void {
        this.setState({ newUsername: newUsername });
    } 

    private onEmailChanged(event: object, newEmail: string): void {
        this.setState({ newEmail: newEmail });
    } 

    private onDiscordChanged(event: object, newDiscord: string): void {
        this.setState({ newDiscord: newDiscord });
    } 

    private onSteamChanged(event: object, newSteam: string): void {
        this.setState({ newSteam: newSteam });
    } 

    private onTwitchChanged(event: object, newTwitch: string): void {
        this.setState({ newTwitch: newTwitch });
    } 

    private logout(): void {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        this.props.history.push(`/`);
    }

    render() {
        const settingStyle = {
            floatingLabel: { 
                'color': 'rgba(255,255,255,0.35)' 
            },
            floatingLabelFocus: { 
                'color': 'whitesmoke'
            },
            input: { 
                'color': 'whitesmoke'
            },
            hint: { 
                'color': 'whitesmoke'
            },
            underlineFocus: {
                'border-bottom': '2px solid rgba(255,255,255,0.2)'
            }
        };
        const logoutStyle = {
            'font-size': '1.2em', 
            'letter-spacing': '3px', 
            'font-weight': '700'
        };

        if (this.state.isLoading) {
            return (
                <div className="account-center">
                    <Spinner loadingMsg={this.state.loadingMsg} />
                </div>
            );
        }

        return (
            <div className="account-settings">
                <div className="account-settings-title">
                    <div className="ribbon">
                        <span className="left-fold"/>
                        <h1>Account Profile</h1>
                        <span className="right-fold"/>
                    </div>
                </div>
                <div className="account-settings-container">
                    <TextField
                        className="account-settings-username"
                        floatingLabelStyle={settingStyle.floatingLabel}
                        floatingLabelFocusStyle={settingStyle.floatingLabelFocus}
                        inputStyle={settingStyle.input}
                        hintStyle={settingStyle.hint}
                        underlineFocusStyle={settingStyle.underlineFocus}
                        defaultValue={this.state.username}
                        onChange={this.onUsernameChanged}
                        floatingLabelText="Username"
                    />
                    <RaisedButton className="account-settings-change" label="Change" primary={true} disabled={this.state.newUsername === '' || this.state.username === this.state.newUsername} onClick={this.changeUsername}/>
                </div>
                <div className="account-settings-container">
                    <TextField
                        className="account-settings-email"
                        floatingLabelStyle={settingStyle.floatingLabel}
                        floatingLabelFocusStyle={settingStyle.floatingLabelFocus}
                        inputStyle={settingStyle.input}
                        hintStyle={settingStyle.hint}
                        underlineFocusStyle={settingStyle.underlineFocus}
                        defaultValue={this.state.email}
                        onChange={this.onEmailChanged}
                        floatingLabelText="Email"
                    />
                    <RaisedButton className="account-settings-change" label="Change" primary={true} disabled={this.state.newEmail === '' || this.state.email === this.state.newEmail} onClick={this.changeEmail}/>
                </div>
                <hr className="account-settings-hr" />
                <div className="account-settings-container">
                    <a href="www.google.com" className="account-settings-link-icon"><i className="fab fa-discord fa-3x"/></a>
                    <TextField
                        className="account-settings-link"
                        floatingLabelStyle={settingStyle.floatingLabel}
                        floatingLabelFocusStyle={settingStyle.floatingLabelFocus}
                        inputStyle={settingStyle.input}
                        hintStyle={settingStyle.hint}
                        underlineFocusStyle={settingStyle.underlineFocus}
                        defaultValue={this.state.discord}
                        onChange={this.onDiscordChanged}
                        floatingLabelText="Discord Link"
                    />
                    <RaisedButton className="account-settings-change" label="Change" primary={true} disabled={this.state.newDiscord === '' || this.state.discord === this.state.newDiscord} onClick={this.changeDiscord}/>
                </div>
                <div className="account-settings-container">
                    <a href="www.google.com" className="account-settings-link-icon"><i className="fab fa-steam-square fa-3x"/></a>
                    <TextField
                        className="account-settings-link"
                        floatingLabelStyle={settingStyle.floatingLabel}
                        floatingLabelFocusStyle={settingStyle.floatingLabelFocus}
                        inputStyle={settingStyle.input}
                        hintStyle={settingStyle.hint}
                        underlineFocusStyle={settingStyle.underlineFocus}
                        defaultValue={this.state.steam}
                        onChange={this.onSteamChanged}
                        floatingLabelText="Steam Link"
                    />
                    <RaisedButton className="account-settings-change" label="Change" primary={true} disabled={this.state.newSteam === '' || this.state.steam === this.state.newSteam} onClick={this.changeSteam}/>
                </div>
                <div className="account-settings-container">
                    <a href="www.google.com" className="account-settings-link-icon"><i className="fab fa-twitch fa-3x"/></a>
                    <TextField
                        className="account-settings-link"
                        floatingLabelStyle={settingStyle.floatingLabel}
                        floatingLabelFocusStyle={settingStyle.floatingLabelFocus}
                        inputStyle={settingStyle.input}
                        hintStyle={settingStyle.hint}
                        underlineFocusStyle={settingStyle.underlineFocus}
                        defaultValue={this.state.twitch}
                        onChange={this.onTwitchChanged}
                        floatingLabelText="Twitch Link"
                    />
                    <RaisedButton className="account-settings-change" label="Change" primary={true} disabled={this.state.newTwitch === '' || this.state.twitch === this.state.newTwitch} onClick={this.changeTwitch}/>
                </div>
                <RaisedButton className="account-settings-logout" label="Logout" labelStyle={logoutStyle} primary={true} onClick={this.logout}/>
            </div>
        );
    }

}

export default withRouter(SettingsForm);