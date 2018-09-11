import * as React from 'react';
import Spinner from '../../spinner/main';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    onUsernameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDiscordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSteamChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTwitchChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    showLinksChanged: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
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
                        label="Username"
                    />
                </div>
                <div className="account-settings-container">
                    <TextField
                        className={props.emailVerified ? "account-settings-email" : "account-settings-email-unverified"} 
                        defaultValue={props.email}
                        onChange={props.onEmailChanged}
                        label={!props.emailVerified ? "Email (Unverified)" : "Email"}
                    />
                    {!props.emailVerified && 
                        <Button 
                            variant="raised" 
                            className="account-settings-email-unverified-btn" 
                            color="primary" 
                            onClick={() => { props.resend(); }}
                        >
                            Resend
                        </Button>}
                </div>
                <div className="account-settings-container">
                    <TextField
                        className="account-settings-password"
                        type="password"
                        defaultValue={props.password}
                        onChange={props.onPasswordChanged}
                        label="New password"
                    />
                </div>
                <FormControlLabel
                    className="account-settings-showlinks large-checkbox"
                    control={
                        <Switch
                            onChange={props.showLinksChanged}
                            color="primary"
                        />
                    }
                    label="Show profile links"
                />
                {props.showLinks && 
                    <div>
                        <div className="account-settings-container">
                            <i className="fab fa-discord fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={props.discord}
                                onChange={props.onDiscordChanged}
                                label="Discord Server Link"
                            />
                        </div>
                        <div className="account-settings-container">
                            <i className="fab fa-steam-square fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={props.steam}
                                onChange={props.onSteamChanged}
                                label="Steam name"
                            />
                        </div>
                        <div className="account-settings-container">
                            <i className="fab fa-twitch fa-3x account-settings-link-icon"/>
                            <TextField
                                className="account-settings-link"
                                defaultValue={props.twitch}
                                onChange={props.onTwitchChanged}
                                label="Twitch Name"
                            />
                        </div>
                    </div>}
                <Button 
                    variant="raised" 
                    className="account-settings-logout"
                    color="primary" 
                    onClick={props.logout}
                >
                    Logout
                </Button>
                {showSaveChanges && 
                    <Button 
                        variant="raised" 
                        className="account-settings-savechanges"
                        color="primary" 
                        onClick={props.saveChanges}
                    >
                        Save Changes
                    </Button>}
                
            </div>
        );

};

export default SettingsForm;