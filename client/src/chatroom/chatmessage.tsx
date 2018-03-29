import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import Avatar from 'material-ui/Avatar';

export interface IChatMessageProps {
    name: string;
    date: Date;
    text: string;
    image: string;
}

class ChatMessage extends React.Component<IChatMessageProps, any> {

    constructor(props: IChatMessageProps) {
        super(props);
    }

    /**
     * Convert Date->MM-DD-YYYY/Today at/Yesterday at/<day_of_week> at.
     */
    private getFormattedDate(dateObj: any): string {
        const date = new Date(dateObj);
        const today = new Date();
        const yesterday = new Date();
        const lastweek = new Date();
        yesterday.setDate(today.getDate() - 1);
        lastweek.setDate(today.getDate() - 7);
        if (today.toLocaleDateString() === date.toLocaleDateString()) {
            return "Today at";
        } else if (yesterday.toLocaleDateString() === date.toLocaleDateString()) {
            return "Yesterday at";
        } else if (date.toLocaleDateString() > lastweek.toLocaleDateString()) {
            return `${date.toLocaleString(window.navigator.language, {weekday: "long"})} at`;
        } else {
            return date.toLocaleDateString();
        }
    }

    render() {
        const formattedDate = this.getFormattedDate(new Date(this.props.date));
        const formattedTime = new Date(this.props.date).toLocaleTimeString();
        const formattedDateTime: string = `${formattedDate} ${formattedTime}`;

        return (
            <div className="chatroom-message fadeIn">
                <div className="chatroom-message-icon-container">
                    {this.props.image
                    ? <Avatar className="chatroom-message-icon-transparent center" src={this.props.image}/>
                    : <Avatar className="chatroom-message-icon center">{this.props.name.slice(0, 2).toUpperCase()}</Avatar>}
                </div>
                <div className="chatroom-message-header">
                    <strong className="chatroom-message-header-username">
                        {this.props.name}
                    </strong>
                    <strong className="chatroom-message-header-time">
                        {formattedDateTime}
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