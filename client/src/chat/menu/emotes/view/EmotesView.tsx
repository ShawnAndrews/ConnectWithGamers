import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Spinner from '../../../../spinner/main';
import { ChatroomEmote } from '../../../../../client-server-common/common';
import { Paper } from '@material-ui/core';

interface IEmotesViewProps {
    isLoading: boolean;
    emotes: ChatroomEmote[];
}

const EmotesView: React.SFC<IEmotesViewProps> = (props: IEmotesViewProps) => {

    if (props.isLoading) {
        return (
            <div className="account-center margin-top">
                <Spinner className="margin-top text-center mt-5" loadingMsg="Loading..." />
            </div>
        );
    }

    const prefixes: string[] = props.emotes.length !== 0 ? props.emotes.map((emote: ChatroomEmote) => { return emote.prefix; }) : [];
    const uniquePrefixes: string[] = prefixes.length !== 0 ? prefixes.filter((val: string, index: number, vals: string[]) => { return vals.indexOf(val) === index; }) : [];

    return (
        <div className="py-3 h-100">
            <div className={`emotes-view y-scrollable custom-scrollbar px-3 mx-2 h-100`}>
                {uniquePrefixes.length !== 0 && 
                    uniquePrefixes.map((uniquePrefix: string) => {
                        return (
                            <Paper key={uniquePrefix} className="user-container my-3 p-2 w-100" elevation={2}>
                                <Typography className="emotes-container-title color-tertiary" component="h3">
                                    Emotes by <strong className="color-tertiary">{uniquePrefix}</strong>
                                </Typography>
                                <div className="emotes-container row p-2 m-0">
                                    {props.emotes
                                    .filter((emote: ChatroomEmote) => (
                                        emote.prefix === uniquePrefix
                                    ))
                                    .map((emote: ChatroomEmote) => {
                                        const emoteLink: string = `/cache/chatroom/emote/${emote.prefix}${emote.suffix}.${emote.fileExtension}`;

                                        return (
                                            <div className="emote color-tertiary m-2" key={`${emote.prefix}${emote.suffix}`}>
                                                <img src={emoteLink} width="28px" height="28px"/>
                                                <div>{`${emote.prefix}${emote.suffix}`}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Paper>
                        );
                    })}
            </div>
        </div>
    );

};

export default EmotesView;