import * as React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Spinner from '../../spinner/main';
import Button from '@material-ui/core/Button';
import { ChatroomEmote } from '../../../client-server-common/common';

interface ISettingsProps {
    isLoading: boolean;
    isLoadingCreate: boolean;
    emotePrefix: string;
    uploadedImage: string;
    emoteSuffix: string;
    emoteCompletionScreen: boolean;
    emotes: ChatroomEmote[];
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleEmoteNameChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onClickCreateEmote: () => void;
    onClickCreateBack: () => void;
}

const Settings: React.SFC<ISettingsProps> = (props: ISettingsProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center margin-top">
                <Spinner className="margin-top" loadingMsg="Loading..." />
            </div>
        );
    }

    const prefixes: string[] = props.emotes.length !== 0 ? props.emotes.map((emote: ChatroomEmote) => { return emote.prefix; }) : [];
    const uniquePrefixes: string[] = prefixes.length !== 0 ? prefixes.filter((val: string, index: number, vals: string[]) => { return vals.indexOf(val) === index; }) : [];

    return (
        <div className={`settings scrollable fadeIn`}>
            <ExpansionPanel className="panel">
                <ExpansionPanelSummary expandIcon={<i className="fas fa-chevron-down"/>}>
                <Typography>View emotes</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="view-container-vertical">
                        {uniquePrefixes.length !== 0 && 
                            uniquePrefixes.map((uniquePrefix: string) => {
                                return (
                                    <div key={uniquePrefix}>
                                        <div className="view-title"><strong>{uniquePrefix}</strong> emotes:</div>
                                        <div className="view-container">
                                            {props.emotes
                                            .filter((emote: ChatroomEmote) => {
                                                return emote.prefix === uniquePrefix;
                                            })
                                            .map((emote: ChatroomEmote) => {
                                                return (
                                                    <div className="view-emote" key={`${emote.prefix}${emote.suffix}`}>
                                                        <img src={emote.link} width="28px" height="28px"/>
                                                        <div>{`${emote.prefix}${emote.suffix}`}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel className="panel">
                <ExpansionPanelSummary expandIcon={<i className="fas fa-chevron-down"/>}>
                <Typography>Create emote</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {props.isLoadingCreate && 
                        <div className="chatroom-settings-spinner">
                            <div className="account-center margin-top">
                                <Spinner className="margin-top" loadingMsg="Loading..." />
                            </div>
                        </div>}
                    {props.emoteCompletionScreen && 
                        <div className="create-completion">
                            <i className="far fa-check-circle fa-5x"/>
                            <span>Successfully created emote!</span>
                            <Button variant="raised" className="create-completion-btn" color="primary" onClick={props.onClickCreateBack}>
                                Back
                            </Button>
                        </div>}
                    {!props.emoteCompletionScreen && !props.isLoadingCreate &&
                        <div className="full-width">
                            <div className="create-container">
                                {props.uploadedImage
                                    ? <Avatar className="create-chip" src={props.uploadedImage}/>
                                    : <Avatar className="create-chip"/>}
                                {!props.uploadedImage && 
                                    <div className="create-chip-overlay">
                                        <i className="fas fa-plus create-chip-overlay-plus"/>
                                    </div>}
                                <input className="create-chip-input" type="file" onChange={props.handleImageChange} />
                            </div>
                            <div className="create-previewtext">
                                Preview
                            </div>
                            <FormControl fullWidth={true} className="create-name">
                                <InputLabel htmlFor="adornment-emote-name">Emote name</InputLabel>
                                <Input
                                    id="adornment-emote-name"
                                    value={props.emoteSuffix}
                                    onChange={props.handleEmoteNameChange}
                                    startAdornment={<InputAdornment position="start">{props.emotePrefix}</InputAdornment>}
                                />
                            </FormControl>
                            <Button variant="raised" className="create-emote-btn" color="primary" onClick={props.onClickCreateEmote}>
                                Create Emote
                            </Button>
                        </div>}
                    
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );

};

export default Settings;