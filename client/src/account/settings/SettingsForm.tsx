import * as React from 'react';
import Spinner from '../../spinner/main';
import Avatar from '@material-ui/core/Avatar';
import { Paper, TextField, Button, FormControlLabel, Switch } from '@material-ui/core';

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
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageDelete: (event: React.MouseEvent<HTMLDivElement>) => void;
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
                <Spinner className="text-center mt-5" loadingMsg={props.loadingMsg} />
            </div>
        );
    }

    return (
        <Paper className="settings bg-secondary-solid p-4 mx-auto mt-5 position-relative" elevation={24}>
            <div className="chip-container position-relative">
                {props.image
                    ? <Avatar className="chip mx-auto bg-primary-solid mt-3" src={props.image}/>
                    : <Avatar className="chip mx-auto bg-primary-solid mt-3"/>}
                {!props.image && <i className="fas fa-plus plus-icon color-secondary center "/>}
                <input className="chip-input-hidden rounded-circle" type="file" onChange={props.handleImageChange}/>
            </div>
            {props.image &&
                <div className="chip-discard-container position-relative" onClick={props.handleImageDelete}>
                    <Avatar className="chip-discard mx-auto bg-primary-solid hover-primary mt-2"/>
                    <i className="far fa-trash-alt color-secondary center no-events"/>
                </div>}
            <div className="username mx-auto mt-4">
                <TextField
                    className="custom-account-form-group"
                    label="Username"
                    value={props.newUsername}
                    onChange={props.onUsernameChanged}
                    margin="normal"
                    fullWidth={true}
                />
            </div>
            <div className="email row mx-auto">
                <div className={`${props.emailVerified ? 'col-12' : 'col-9'} p-0`}>
                    <TextField
                        className="custom-account-form-group"
                        label={!props.emailVerified ? "Email (Unverified)" : "Email"}
                        value={props.newEmail}
                        onChange={props.onEmailChanged}
                        margin="normal"
                        fullWidth={true}
                    />
                </div>
                {!props.emailVerified &&
                    <div className="col-3 pr-0">
                        <Button className="resend-btn color-secondary bg-primary-solid hover-primary-solid" onClick={props.resend} variant="contained" fullWidth={true}>
                            Resend
                        </Button>
                    </div>}
            </div>
            <div className="password mx-auto">
                <TextField
                    className="custom-account-form-group"
                    label="New password"
                    value={props.newPassword}
                    defaultValue={props.password}
                    onChange={props.onPasswordChanged}
                    type="password"
                    margin="normal"
                    fullWidth={true}
                />
            </div>
            <FormControlLabel
                className={`showlinks custom-switch ${props.showLinks ? 'active' : ''} m-0`}
                control={
                    <Switch
                        onChange={props.showLinksChanged}
                        color="primary"
                    />
                }
                label="Show profile links"
            />
            {props.showLinks && 
                <>
                    <div className="link-container row mx-0 mt-4">
                        <i className="fab fa-discord fa-3x col-2 p-0"/>
                        <TextField
                            className="custom-account-form-group col-10"
                            defaultValue={props.newDiscord}
                            onChange={props.onDiscordChanged}
                            label="Discord Server Link"
                            fullWidth={true}
                        />
                    </div>
                    <div className="link-container row mx-0 mt-2">
                        <i className="fab fa-steam-square fa-3x col-2 p-0"/>
                        <TextField
                            className="custom-account-form-group col-10"
                            defaultValue={props.newSteam}
                            onChange={props.onSteamChanged}
                            label="Steam name"
                            fullWidth={true}
                        />
                    </div>
                    <div className="link-container row mx-0 mt-2">
                        <i className="fab fa-twitch fa-3x col-2 p-0"/>
                        <TextField
                            className="custom-account-form-group col-10"
                            defaultValue={props.newTwitch}
                            onChange={props.onTwitchChanged}
                            label="Twitch Name"
                            fullWidth={true}
                        />
                    </div>
                </>}
            <Button className="logout-btn color-secondary bg-primary-solid hover-primary-solid mt-3" onClick={props.logout} variant="contained" fullWidth={true}>
                Logout
            </Button>
            {showSaveChanges && 
                <Button 
                    variant="raised" 
                    className="save br-0"
                    color="primary" 
                    onClick={props.saveChanges}
                >
                    Save Changes
                </Button>}  
        </Paper>
    );
};

export default SettingsForm;