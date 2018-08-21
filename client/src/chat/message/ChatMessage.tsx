import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import Avatar from 'material-ui/Avatar';
import { getFormattedDate } from '../../util/main';
import { MessageSide } from '../room/chatroom';

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

    return (
        <div className={`chatroom-message-left ${props.timeVisible ? "time-visible" : "time-invisible"} fadeIn`} onClick={props.changeTimeVisibility}>
            <div className="chatroom-message-text-container">
                <div className={`chatroom-message-text${props.repeat ? "-repeat" : ""}`}>
                    {props.text}
                    {props.attachment &&
                        <img src={props.attachment} alt="Attachment" height="100%" width="100%"/>}
                </div>
                {!props.repeat && 
                    <div className="chatroom-message-metadata">
                        <div className="chatroom-message-icon-container">
                            {props.image
                                ? <Avatar className="chatroom-message-icon-transparent" src={props.image}/>
                                : <Avatar className="chatroom-message-icon">{props.name.slice(0, 2).toUpperCase()}</Avatar>}
                        </div>
                        <strong className="chatroom-message-username">{props.name}</strong>
                    </div>}
                {props.timeVisible && <strong className="chatroom-message-time fadeIn">{formattedDateTime}</strong>}
            </div>
        </div>
    );

};

export default ChatMessage;