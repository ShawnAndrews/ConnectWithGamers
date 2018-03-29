const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import * as AccountService from '../service/account/main';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Toggle from 'material-ui/Toggle';
import { AUTH_TOKEN_NAME, GenericResponseModel, AccountImageResponse } from '../../client-server-common/common';

interface ISettingsFormProps {
    history: any;
}

class SettingsForm extends React.Component<ISettingsFormProps, any> {

    constructor(props: ISettingsFormProps) {
        super(props);
        this.loadSettings = this.loadSettings.bind(this);
        this.onUsernameChanged = this.onUsernameChanged.bind(this);
        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onDiscordChanged = this.onDiscordChanged.bind(this);
        this.onSteamChanged = this.onSteamChanged.bind(this);
        this.onTwitchChanged = this.onTwitchChanged.bind(this);
        this.showLinksChanged = this.showLinksChanged.bind(this);
        this.logout = this.logout.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        this.state = {
            showLinks: false,
            isLoading: true,
            loadingMsg: `Loading account settings...`
        };
        this.loadSettings();
    }

    private loadSettings(): void {
        AccountService.httpAccountSettings()
            .then( (response: GenericResponseModel) => {
                const username = response.data.username;
                const email = response.data.email;
                const password = '';
                const discord = response.data.discord;
                const steam = response.data.steam;
                const twitch = response.data.twitch;
                const image = response.data.image;
                this.setState({ 
                    isLoading: false, 
                    username: username, 
                    email: email,
                    password: ``,
                    discord: discord,
                    steam: steam,
                    twitch: twitch,
                    newUsername: username, 
                    newEmail: email,
                    newPassword: ``,
                    newDiscord: discord,
                    newSteam: steam,
                    newTwitch: twitch,
                    image: image});
            })
            .catch( (error: string) => {
                this.setState({ isLoading: false });
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.props.history.push(`/`);
            });
    }

    private onUsernameChanged(event: object, newUsername: string): void {
        this.setState({ newUsername: newUsername });
    } 

    private onEmailChanged(event: object, newEmail: string): void {
        this.setState({ newEmail: newEmail });
    } 

    private onPasswordChanged(event: object, newPassword: string): void {
        this.setState({ newPassword: newPassword });
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
        document.cookie = `${AUTH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        this.props.history.push(`/`);
    }

    private saveChanges(): void {
        const newSettings: any  = {};
        
        if (this.state.username !== this.state.newUsername) {
            newSettings.username = this.state.newUsername;
        }

        if (this.state.email !== this.state.newEmail) {
            newSettings.email = this.state.newEmail;
        }

        if (`` !== this.state.newPassword) {
            newSettings.password = this.state.newPassword;
        }

        if (this.state.discord !== this.state.newDiscord) {
            newSettings.discord = this.state.newDiscord;
        }
        
        if (this.state.steam !== this.state.newSteam) {
            newSettings.steam = this.state.newSteam;
        }

        if (this.state.twitch !== this.state.newTwitch) {
            newSettings.twitch = this.state.newTwitch;
        }

        this.setState({ isLoading: true, loadingMsg: `Changing account settings...` }, () => {
            AccountService.httpChangeAccountSettings(newSettings)
                .then( () => {
                    this.setState({ 
                        isLoading: false,
                        username: this.state.newUsername,
                        email: this.state.newEmail,
                        password: ``,
                        newPassword: ``,
                        discord: this.state.newDiscord,
                        steam: this.state.newSteam,
                        twitch: this.state.newTwitch });
                })
                .catch( (error: string) => {
                    this.setState({ 
                        isLoading: false,
                        newUsername: this.state.username,
                        newEmail: this.state.email,
                        newPassword: this.state.password,
                        newDiscord: this.state.discord,
                        newSteam: this.state.steam,
                        newTwitch: this.state.twitch });
                    popupS.modal({ content: `<div>• ${error}</div>` });
                });
        });
    }

    private handleImageChange(event: any) {
        const getBase64 = (file: any) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        getBase64(event.target.files[0])
        .then((imageBase64: string) => {
            this.setState({ isLoading: true, loadingMsg: `Updating profile picture...` }, () => {
                AccountService.httpChangeAccountImage(imageBase64)
                    .then( (response: AccountImageResponse) => {
                        this.setState({
                            isLoading: false,
                            image: response.link });
                    })
                    .catch( (error: string) => {
                        this.setState({ 
                            isLoading: false });
                        popupS.modal({ content: `<div>• ${error}</div>` });
                    });
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>Error converting image to base 64. ${error}</div>` });
        });
    }

    private handleImageDelete() {
        this.setState({ isLoading: true, loadingMsg: `Deleting profile picture...` }, () => {
            AccountService.httpDeleteAccountImage()
                .then( (response: AccountImageResponse) => {
                    this.setState({
                        isLoading: false,
                        image: response.link });
                })
                .catch( (error: string) => {
                    this.setState({ 
                        isLoading: false });
                    popupS.modal({ content: `<div>• ${error}</div>` });
                }); 
        });
    }

    private showLinksChanged(event: any, isInputChecked: boolean) {
        this.setState({showLinks: isInputChecked});
    }

    render() {
        const showSaveChanges: boolean = 
            (this.state.username !== this.state.newUsername) || 
            (this.state.email !== this.state.newEmail) || 
            (this.state.newPassword !== ``) ||
            (this.state.discord !== this.state.newDiscord) ||
            (this.state.steam !== this.state.newSteam) ||
            (this.state.twitch !== this.state.newTwitch);

        if (this.state.isLoading) {
            return (
                <div className="account-center">
                    <Spinner loadingMsg={this.state.loadingMsg} />
                </div>
            );
        }

        return (
            <div className="account-settings scrollable">
                <div className="account-settings-title">
                    <div className="account-settings-title-container">
                        {this.state.image
                            ? <Avatar className="account-settings-title-chip" src={this.state.image}/>
                            : <Avatar className="account-settings-title-chip"/>}
                        <div className="account-settings-title-overlay-container">
                            {!this.state.image && 
                                <div className="account-settings-title-center">
                                    <i className="far fa-file-image account-settings-title-image"/>
                                    <i className="fas fa-plus account-settings-title-plus"/>
                                </div>}
                        </div>
                        <input className="account-settings-title-input" type="file" onChange={(e) => this.handleImageChange(e)} />
                    </div>
                    <div className="account-settings-title-discard-container">
                        {this.state.image &&
                            <div className="account-settings-title-overlay-container" onClick={() => this.handleImageDelete()}>
                                <Avatar className="account-settings-title-chip-discard"/>
                                <div className="account-settings-title-center">
                                    <i className="far fa-trash-alt account-settings-title-image"/>
                                </div>
                            </div>}
                    </div>
                </div>
                <div className="account-settings-container">
                    <TextField
                        className="account-settings-username"
                        defaultValue={this.state.username}
                        onChange={this.onUsernameChanged}
                        floatingLabelText="Username"
                    />
                </div>
                <div className="account-settings-container">
                    <TextField
                        className="account-settings-email"
                        defaultValue={this.state.email}
                        onChange={this.onEmailChanged}
                        floatingLabelText="Email"
                    />
                </div>
                <div className="account-settings-container">
                    <TextField
                        className="account-settings-password"
                        type="password"
                        defaultValue={this.state.password}
                        onChange={this.onPasswordChanged}
                        floatingLabelText="New password"
                    />
                </div>
                <Toggle
                    className="account-settings-showlinks large-checkbox"
                    label="Show profile links"
                    onToggle={this.showLinksChanged}
                />
                {this.state.showLinks && 
                    <div>
                        <div className="account-settings-container">
                            <i className="fab fa-discord fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={this.state.discord}
                                onChange={this.onDiscordChanged}
                                floatingLabelText="Discord Link"
                            />
                        </div>
                        <div className="account-settings-container">
                            <i className="fab fa-steam-square fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={this.state.steam}
                                onChange={this.onSteamChanged}
                                floatingLabelText="Steam Link"
                            />
                        </div>
                        <div className="account-settings-container">
                            <i className="fab fa-twitch fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={this.state.twitch}
                                onChange={this.onTwitchChanged}
                                floatingLabelText="Twitch Link"
                            />
                        </div>
                    </div>}
                <RaisedButton className="account-settings-logout" label="Logout" primary={true} onClick={this.logout}/>
                {showSaveChanges && 
                    <RaisedButton className="account-settings-savechanges" label="Save Changes" primary={true} onClick={this.saveChanges}/>}
                
            </div>
        );
    }

}

export default withRouter(SettingsForm);