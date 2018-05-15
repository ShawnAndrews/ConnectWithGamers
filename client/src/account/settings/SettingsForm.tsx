const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Spinner from '../../spinner/main';
import * as AccountService from '../../service/account/main';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Toggle from 'material-ui/Toggle';

interface ISettingsFormProps {
    isLoading: boolean;
    loadingMsg: string;
    showLinks: boolean;
    image: string;
    username: string;
    password: string;
    email: string;
    emailVerified: boolean;
    discord: string;
    steam: string;
    twitch: string;
    newUsername: string;
    newPassword: string;
    newEmail: string;
    newDiscord: string;
    newSteam: string;
    newTwitch: string;
    onUsernameChanged: (event: object, newUsername: string) => void;
    onPasswordChanged: (event: object, newPassword: string) => void;
    onEmailChanged: (event: object, newEmail: string) => void;
    onDiscordChanged: (event: object, newDiscord: string) => void;
    onSteamChanged: (event: object, newSteam: string) => void;
    onTwitchChanged: (event: object, newTwitch: string) => void;
    showLinksChanged: (event: any, isInputChecked: boolean) => void;
    handleImageChange: (event: any) => void;
    handleImageDelete: () => void;
    saveChanges: () => void;
    resend: () => void;
    logout: () => void;
}

const SettingsForm: React.SFC<ISettingsFormProps> = (props: ISettingsFormProps) => {

    const showSaveChanges: boolean = 
            (props.username !== props.newUsername) || 
            (props.email !== props.newEmail) || 
            (props.newPassword !== ``) ||
            (props.discord !== props.newDiscord) ||
            (props.steam !== props.newSteam) ||
            (props.twitch !== props.newTwitch);

        if (props.isLoading) {
            return (
                <div className="account-center">
                    <Spinner loadingMsg={props.loadingMsg} />
                </div>
            );
        }

        return (
            <div className="account-settings scrollable">
                <div className="account-settings-title">
                    <div className="account-settings-title-container">
                        {props.image
                            ? <Avatar className="account-settings-title-chip" src={props.image}/>
                            : <Avatar className="account-settings-title-chip"/>}
                        <div className="account-settings-title-overlay-container">
                            {!props.image && 
                                <div className="account-settings-title-center">
                                    <i className="far fa-file-image account-settings-title-image"/>
                                    <i className="fas fa-plus account-settings-title-plus"/>
                                </div>}
                        </div>
                        <input className="account-settings-title-input" type="file" onChange={(e) => props.handleImageChange(e)} />
                    </div>
                    <div className="account-settings-title-discard-container">
                        {props.image &&
                            <div className="account-settings-title-overlay-container" onClick={() => props.handleImageDelete()}>
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
                        defaultValue={props.username}
                        onChange={props.onUsernameChanged}
                        floatingLabelText="Username"
                    />
                </div>
                <div className="account-settings-container">
                    <TextField
                        className={props.emailVerified ? "account-settings-email" : "account-settings-email-unverified"} 
                        defaultValue={props.email}
                        onChange={props.onEmailChanged}
                        floatingLabelText={!props.emailVerified ? "Email (Unverified)" : "Email"}
                    />
                    {!props.emailVerified && 
                        <RaisedButton className="account-settings-email-unverified-btn" label="Resend" primary={true} onClick={() => { props.resend(); }}/>}
                </div>
                <div className="account-settings-container">
                    <TextField
                        className="account-settings-password"
                        type="password"
                        defaultValue={props.password}
                        onChange={props.onPasswordChanged}
                        floatingLabelText="New password"
                    />
                </div>
                <Toggle
                    className="account-settings-showlinks large-checkbox"
                    label="Show profile links"
                    onToggle={props.showLinksChanged}
                />
                {props.showLinks && 
                    <div>
                        <div className="account-settings-container">
                            <i className="fab fa-discord fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={props.discord}
                                onChange={props.onDiscordChanged}
                                floatingLabelText="Discord Server Link"
                            />
                        </div>
                        <div className="account-settings-container">
                            <i className="fab fa-steam-square fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={props.steam}
                                onChange={props.onSteamChanged}
                                floatingLabelText="Steam name"
                            />
                        </div>
                        <div className="account-settings-container">
                            <i className="fab fa-twitch fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={props.twitch}
                                onChange={props.onTwitchChanged}
                                floatingLabelText="Twitch Name"
                            />
                        </div>
                    </div>}
                <RaisedButton className="account-settings-logout" label="Logout" primary={true} onClick={props.logout}/>
                {showSaveChanges && 
                    <RaisedButton className="account-settings-savechanges" label="Save Changes" primary={true} onClick={props.saveChanges}/>}
                
            </div>
        );

};

export default SettingsForm;