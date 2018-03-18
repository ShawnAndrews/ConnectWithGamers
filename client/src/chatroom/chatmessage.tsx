import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import Avatar from 'material-ui/Avatar';

export interface IChatMessageProps {
    name: string;
    date: string;
    text: string;
}

class ChatMessage extends React.Component<IChatMessageProps, any> {

    constructor(props: IChatMessageProps) {
        super(props);
    }

    render() {

        return (
            <div className="chatroom-message fadeIn">
                <div className="chatroom-message-icon-container">
                    <Avatar className="chatroom-message-icon center">
                        {this.props.name.slice(0, 2).toUpperCase()}
                    </Avatar>
                </div>
                <div className="chatroom-message-header">
                    <strong className="chatroom-message-header-username">
                        {this.props.name}
                    </strong>
                    <strong className="chatroom-message-header-time">
                        {this.props.date}
                    </strong>
                </div> 
                <div className="chatroom-message-text-container">
                    <div className="chatroom-message-text">
                         {this.props.text}
                    </div>
                </div>
            </div>
        );

    }

}

export default ChatMessage;