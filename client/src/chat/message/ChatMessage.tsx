import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import Avatar from 'material-ui/Avatar';
import { getFormattedDate } from '../../util/main';

interface IChatMessageProps {
    name: string;
    date: Date;
    text: string;
    image: string;
    timeVisible: boolean;
    changeTimeVisibility: () => void;
}

const ChatMessage: React.SFC<IChatMessageProps> = (props: IChatMessageProps) => {

    const formattedDate = getFormattedDate(new Date(props.date));
    const formattedTime = new Date(props.date).toLocaleTimeString();
    const formattedDateTime: string = `${formattedDate} ${formattedTime}`;

    return (
        <div className={props.timeVisible ? "chatroom-message time-visible fadeIn" : "chatroom-message time-invisible fadeIn"} onClick={props.changeTimeVisibility}>
            <div className="chatroom-message-text-container">
                <div className="chatroom-message-text">
                    {props.text}
                </div>
                <div className="chatroom-message-icon-container">
                    {props.image
                    ? <Avatar className="chatroom-message-icon-transparent" src={props.image}/>
                    : <Avatar className="chatroom-message-icon">{props.name.slice(0, 2).toUpperCase()}</Avatar>}
                </div>
                <strong className="chatroom-message-username">{props.name}</strong>
                {props.timeVisible && <strong className="chatroom-message-time fadeIn">{formattedDateTime}</strong>}
            </div>
        </div>
    );

};

export default ChatMessage;