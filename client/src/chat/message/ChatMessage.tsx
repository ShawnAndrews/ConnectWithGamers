import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { getFormattedDate } from '../../util/main';
import { MessageSide } from '../room/Chatroom';

interface IChatMessageProps {
    name: string;
    date: Date;
    text: string;
    image: string;
    attachment: string;
    timeVisible: boolean;
    side: MessageSide;
    repeat: boolean;
    changeTimeVisibility: () => void;
}

const ChatMessage: React.SFC<IChatMessageProps> = (props: IChatMessageProps) => {

    const formattedDate = getFormattedDate(new Date(props.date));
    const formattedTime = new Date(props.date).toLocaleTimeString();
    const formattedDateTime: string = `${formattedDate} ${formattedTime}`;

    const decodeEmotes = (text: string): React.ReactNode[] => {
        const result: React.ReactNode[] = [];
        const prefix: string = ":::";
        const suffix: string = ":::";
        let foundPrefix: number = text.indexOf(prefix);
        while (foundPrefix !== -1) {
            const spanText: string = text.substring(0, foundPrefix);
            result.push(<span>{spanText}</span>);

            text = text.substring(foundPrefix + prefix.length);
            const foundSuffix: number = text.indexOf(suffix);
            const emoteLink: string = text.substring(0, foundSuffix);
            result.push(<img src={emoteLink} width="28" height="28" />);

            text = text.substring(foundSuffix + suffix.length);
            foundPrefix = text.indexOf(prefix);
        }
        result.push(<span>{text}</span>);
        return result;
    };

    return (
        <div className={`chatroom-message-left ${props.timeVisible ? "time-visible" : "time-invisible"} fadeIn`} onClick={props.changeTimeVisibility}>
            <div className="chatroom-message-text-container">
                <div className={`chatroom-message-text${props.repeat ? "-repeat" : ""}`}>
                    {decodeEmotes(props.text)}
                    {props.attachment &&
                        <img src={props.attachment} alt="Attachment" className="chatroom-message-attachment"/>}
                </div>
                {!props.repeat && 
                    <div className="chatroom-message-metadata">
                        <div className="chatroom-message-icon-container">
                            {props.image
                                ? <Avatar className="chatroom-message-icon-transparent" src={props.image}/>
                                : <Avatar className="chatroom-message-icon">{props.name.slice(0, 2).toUpperCase()}</Avatar>}
                        </div>
                        <div className="chatroom-message-username-container">
                            <strong className="chatroom-message-username">{props.name}</strong>
                            <div className="chatroom-message-time">{formattedDateTime}</div>
                        </div>
                    </div>}
                {props.timeVisible && <strong className="chatroom-message-time fadeIn">{formattedDateTime}</strong>}
            </div>
        </div>
    );

};

export default ChatMessage;