const popupS = require('popups');
import * as React from 'react';
import SettingsForm from "../settings/settingsForm";
import { withRouter } from 'react-router-dom';
import { AUTH_TOKEN_NAME, GenericResponseModel, AccountImageResponse } from '../../../../client/client-server-common/common';
import * as AccountService from '../../service/account/main';

interface ISettingsFormContainerProps {
    history: any;
}

class SettingsFormContainer extends React.Component<ISettingsFormContainerProps, any> {

    constructor(props: ISettingsFormContainerProps) {
        super(props);
        this.loadSettings = this.loadSettings.bind(this);
        this.onUsernameChanged = this.onUsernameChanged.bind(this);
        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onDiscordChanged = this.onDiscordChanged.bind(this);
        this.onSteamChanged = this.onSteamChanged.bind(this);
        this.onTwitchChanged = this.onTwitchChanged.bind(this);
        this.showLinksChanged = this.showLinksChanged.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleImageDelete = this.handleImageDelete.bind(this);
        this.logout = this.logout.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        this.state = {
            showLinks: false,
            isLoading: true,
            loadingMsg: `Loading account settings...`
        };
        this.loadSettings();
    }

    loadSettings(): void {
        AccountService.httpAccountSettings()
            .then( (response: GenericResponseModel) => {
                const username = response.data.username;
                const email = response.data.email;
                const password = '';
                const discord = response.data.discord;
                const steam = response.data.steam;
                const twitch = response.data.twitch;
                const image = response.data.image;
                const emailVerified = response.data.emailVerified;
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
                    image: image,
                    emailVerified: emailVerified});
            })
            .catch( (error: string) => {
                this.setState({ isLoading: false });
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.props.history.push(`/`);
            });
    }

    onUsernameChanged(event: object, newUsername: string): void {
        this.setState({ newUsername: newUsername });
    } 

    onEmailChanged(event: object, newEmail: string): void {
        this.setState({ newEmail: newEmail });
    } 

    onPasswordChanged(event: object, newPassword: string): void {
        this.setState({ newPassword: newPassword });
    } 

    onDiscordChanged(event: object, newDiscord: string): void {
        this.setState({ newDiscord: newDiscord });
    } 

    onSteamChanged(event: object, newSteam: string): void {
        this.setState({ newSteam: newSteam });
    } 

    onTwitchChanged(event: object, newTwitch: string): void {
        this.setState({ newTwitch: newTwitch });
    } 

    logout(): void {
        document.cookie = `${AUTH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        this.props.history.push(`/`);
    }

    resend(): void {
        this.setState({ isLoading: true, loadingMsg: `Sending verification email...` }, () => {
            AccountService.httpResendAccountEmail()
                .then( () => {
                    this.setState({ isLoading: false });
                    popupS.modal({ content: `<div>Verification email sent to ${this.state.email}! Please check your email and spam folder.</div>` });
                })
                .catch( (error: string) => {
                    this.setState({ isLoading: false });
                    popupS.modal({ content: `<div>• ${error}</div>` });
                });
        });
    }

    saveChanges(): void {
        const newSettings: any  = {};
        const emailChanged: boolean = this.state.email !== this.state.newEmail;

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
                        twitch: this.state.newTwitch,
                        emailVerified: emailChanged ? false : emailChanged });
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

    handleImageChange(event: any): void {
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

    handleImageDelete(): void {
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

    showLinksChanged(event: any, isInputChecked: boolean): void {
        this.setState({showLinks: isInputChecked});
    }

    render() {
        return (
            <SettingsForm 
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                showLinks={this.state.showLinks}
                image={this.state.image}
                username={this.state.username}
                password={this.state.password}
                email={this.state.email}
                emailVerified={this.state.emailVerified}
                discord={this.state.discord}
                steam={this.state.steam}
                twitch={this.state.twitch}
                newUsername={this.state.newUsername}
                newPassword={this.state.newPassword}
                newEmail={this.state.newEmail}
                newDiscord={this.state.newDiscord}
                newSteam={this.state.newSteam}
                newTwitch={this.state.newTwitch}
                onUsernameChanged={this.onUsernameChanged}
                onPasswordChanged={this.onPasswordChanged}
                onEmailChanged={this.onEmailChanged}
                onDiscordChanged={this.onDiscordChanged}
                onSteamChanged={this.onSteamChanged}
                onTwitchChanged={this.onTwitchChanged}
                showLinksChanged={this.showLinksChanged}
                handleImageChange={this.handleImageChange}
                handleImageDelete={this.handleImageDelete}
                saveChanges={this.saveChanges}
                resend={this.resend}
                logout={this.logout}
            />
        );
    }

}

export default withRouter(SettingsFormContainer);