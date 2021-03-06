const popupS = require('popups');
import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import SettingsForm from "../settings/SettingsForm";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AccountImageResponse, AccountInfoResponse } from '../../../../client/client-server-common/common';
import * as AccountService from '../../service/account/main';
import { setLoggedIn } from '../../actions/main';

export interface SettingsData {
    username?: string;
    email?: string;
    password?: string;
    discord?: string;
    steam?: string;
    twitch?: string;
}

interface ISettingsFormContainerProps extends RouteComponentProps<any> { }

interface ReduxStateProps {

}

interface ReduxDispatchProps {
    setLoggedIn: (loggedIn: boolean) => void;
}

type Props = ISettingsFormContainerProps & ReduxStateProps & ReduxDispatchProps;

interface ISettingsFormContainerState {
    accountId: number;
    showLinks: boolean;
    isLoading: boolean;
    username: string;
    email: string;
    password: string;
    discord: string;
    steam: string;
    twitch: string;
    newUsername: string;
    newEmail: string;
    newPassword: string;
    newDiscord: string;
    newSteam: string;
    newTwitch: string;
    loadingMsg: string;
    image: string;
    emailVerified: boolean;
}

class SettingsFormContainer extends React.Component<Props, ISettingsFormContainerState> {

    constructor(props: Props) {
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
        this.resend = this.resend.bind(this);
        this.logout = this.logout.bind(this);
        this.saveChanges = this.saveChanges.bind(this);

        this.state = {
            accountId: undefined,
            showLinks: false,
            isLoading: true,
            username: undefined,
            email: undefined,
            password: undefined,
            discord: undefined,
            steam: undefined,
            twitch: undefined,
            newUsername: undefined,
            newEmail: undefined,
            newPassword: undefined,
            newDiscord: undefined,
            newSteam: undefined,
            newTwitch: undefined,
            loadingMsg: `Loading account settings...`,
            image: undefined,
            emailVerified: undefined
        };

        this.loadSettings();
    }

    loadSettings(): void {
        AccountService.httpAccountSettings()
            .then( (response: AccountInfoResponse) => {
                const profile_file_extension: string = response.data.profile_file_extension;
                const profile: boolean = Boolean(response.data.profile);
                const accountId = response.data.accountid;
                const username = response.data.username;
                const email = response.data.email;
                const password = '';
                const discord = response.data.discord;
                const steam = response.data.steam;
                const twitch = response.data.twitch;
                const emailVerified = response.data.emailVerified;
                const profileLink: string = `/cache/chatroom/profile/${accountId}.${profile_file_extension}`;
                this.setState({ 
                    accountId: accountId,
                    image: profile ? profileLink : undefined,
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
                    emailVerified: emailVerified});
            })
            .catch( (error: string) => {
                this.setState({ isLoading: false });
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.props.history.push(`/`);
            });
    }

    onUsernameChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ newUsername: event.currentTarget.value });
    } 

    onEmailChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ newEmail: event.currentTarget.value });
    } 

    onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ newPassword: event.currentTarget.value });
    } 

    onDiscordChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ newDiscord: event.currentTarget.value });
    } 

    onSteamChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ newSteam: event.currentTarget.value });
    } 

    onTwitchChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ newTwitch: event.currentTarget.value });
    } 

    logout(): void {
        AccountService.logout();
        this.props.setLoggedIn(false);
        this.props.history.push(`/account`);
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
        let newSettings: SettingsData = {};
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
            AccountService.httpChangeAccountInfo(newSettings)
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

    handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const getBase64 = (file: File) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };
        let fileExtension: string = undefined;

        try {
            fileExtension = event.target.files[0].name.split(".")[1];
        } catch (err) { }

        getBase64(event.target.files[0])
        .then((imageBase64: string) => {
            this.setState({ isLoading: true, loadingMsg: `Updating profile picture...` }, () => {
                AccountService.httpChangeAccountImage(imageBase64, fileExtension)
                    .then(() => {
                        const profileLink: string = `/cache/chatroom/profile/${this.state.accountId}.${fileExtension}`;

                        this.setState({
                            isLoading: false,
                            image: profileLink
                        });
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

    handleImageDelete(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({ isLoading: true, loadingMsg: `Deleting profile picture...` }, () => {
            AccountService.httpDeleteAccountImage()
                .then( (response: AccountImageResponse) => {
                    this.setState({
                        isLoading: false,
                        image: undefined });
                })
                .catch( (error: string) => {
                    this.setState({ 
                        isLoading: false });
                    popupS.modal({ content: `<div>• ${error}</div>` });
                }); 
        });
    }

    showLinksChanged(event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void {
        this.setState({showLinks: checked});
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

const mapStateToProps = (state: any, ownProps: ISettingsFormContainerProps): ReduxStateProps => ({});

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ISettingsFormContainerProps): ReduxDispatchProps => ({
    setLoggedIn: (loggedIn: boolean) => { dispatch(setLoggedIn(loggedIn)); },
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ISettingsFormContainerProps>
    (mapStateToProps, mapDispatchToProps)(SettingsFormContainer));