import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Spinner from '../../../../spinner/main';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';

interface IEmotesCreateProps {
    isLoading: boolean;
    isLoadingCreate: boolean;
    emotePrefix: string;
    uploadedImage: string;
    emoteSuffix: string;
    emoteCompletionScreen: boolean;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleEmoteNameChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    onClickCreateEmote: () => void;
    onClickCreateBack: () => void;
    onClickCreateGoToEmotes: () => void;
}

const EmotesCreate: React.SFC<IEmotesCreateProps> = (props: IEmotesCreateProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center margin-top">
                <Spinner className="margin-top" loadingMsg="Loading..." />
            </div>
        );
    }
    
    return (
        <div className={`emotes-view px-3 h-100`}>
            <Paper className="create-container p-2 mt-3" elevation={3}>
                <h4 className="text-center font-weight-bold color-tertiary my-3">Create emote</h4>

                {props.emoteCompletionScreen && 
                    <div className="completion-container">
                        <i className="far fa-check-circle fa-5x d-block text-center color-tertiary"/>
                        <p className="text-center color-tertiary my-3">Successfully created emote!</p>
                        <Button variant="contained" className="bg-primary-solid bg-tertiary color-primary w-100 mt-3" color="primary" onClick={props.onClickCreateBack}>
                            Back
                        </Button>
                        <Button variant="contained" className="bg-primary-solid bg-tertiary color-primary w-100 mt-2" color="primary" onClick={props.onClickCreateGoToEmotes}>
                            Go to emotes
                        </Button>
                    </div>}

                {props.isLoadingCreate && 
                    <div className="chatroom-settings-spinner">
                        <div className="account-center margin-top">
                            <Spinner className="margin-top text-center my-4" loadingMsg="Loading..." />
                        </div>
                    </div>}
                    
                {!props.emoteCompletionScreen && !props.isLoadingCreate &&
                    <>
                        <div className="image-container color-tertiary">
                            {props.uploadedImage
                                ? <Avatar className="image" src={props.uploadedImage}/>
                                : <Avatar className="image"/>}
                            {!props.uploadedImage && 
                                <div className="image-overlay">
                                    <i className="fas fa-plus create-chip-overlay-plus color-primary"/>
                                </div>}
                            <input className="image-hidden-input" type="file" onChange={props.handleImageChange} />
                        </div>
                        <div className="preview-text text-center color-tertiary mt-3">
                            Preview
                        </div>
                        <FormControl fullWidth={true} className="emote-input color-tertiary px-4 my-4">
                            <InputLabel className="ml-4" htmlFor="adornment-emote-name">Emote name</InputLabel>
                            <Input
                                id="adornment-emote-name"
                                value={props.emoteSuffix}
                                onChange={props.handleEmoteNameChange}
                                startAdornment={<InputAdornment position="start" className="mr-0">{props.emotePrefix}</InputAdornment>}
                            />
                        </FormControl>
                        <Button variant="contained" className="create-btn bg-tertiary color-primary w-100" color="primary" onClick={props.onClickCreateEmote}>
                            Create Emote
                        </Button>
                    </>}
            </Paper>
        </div>
    );

};

export default EmotesCreate;