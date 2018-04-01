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
        this.changeTimeVisibility = this.changeTimeVisibility.bind(this);
        this.state = { timeVisible: false };
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

    private changeTimeVisibility(): void {
        this.setState({ timeVisible: !this.state.timeVisible });
    }

    render() {
        const formattedDate = this.getFormattedDate(new Date(this.props.date));
        const formattedTime = new Date(this.props.date).toLocaleTimeString();
        const formattedDateTime: string = `${formattedDate} ${formattedTime}`;

        return (
            <div className={this.state.timeVisible ? "chatroom-message time-visible fadeIn" : "chatroom-message time-invisible fadeIn"} onClick={this.changeTimeVisibility}>
                <div className="chatroom-message-text-container">
                    <div className="chatroom-message-text">
                        {this.props.text}
                    </div>
                    <div className="chatroom-message-icon-container">
                        {this.props.image
                        ? <Avatar className="chatroom-message-icon-transparent" src={this.props.image}/>
                        : <Avatar className="chatroom-message-icon">{this.props.name.slice(0, 2).toUpperCase()}</Avatar>}
                    </div>
                    <strong className="chatroom-message-username">{this.props.name}</strong>
                    {this.state.timeVisible && <strong className="chatroom-message-time fadeIn">{formattedDateTime}</strong>}
                </div>
            </div>
        );

    }

}

export default ChatMessage;