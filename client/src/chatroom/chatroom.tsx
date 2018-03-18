const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import ChatMessage, { IChatMessageProps } from './chatmessage';
import * as ChatroomService from '../service/chatroom/main';
import { AUTH_TOKEN_NAME, CHATROOM_EVENTS, CHAT_SERVER_PORT, ChatHistoryResponse, SingleChatHistory } from '../../../client/client-server-common/common';

interface IChatroomProps {
    history: any;
}

class Chatroom extends React.Component<IChatroomProps, any> {

    constructor(props: IChatroomProps) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.onNewUsercount = this.onNewUsercount.bind(this);
        this.scrollChatToMostRecent = this.scrollChatToMostRecent.bind(this);
        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        this.state = { text: '', chatLog: [], userCount: 0, socket: socket };
        socket.on(CHATROOM_EVENTS.Message, this.onNewMessage);
        socket.on(CHATROOM_EVENTS.Usercount, this.onNewUsercount);
    }

    componentDidMount(): void {
        this.setState({ chatLogContainer: document.querySelector('.chatroom-messages') });
    }

    private scrollChatToMostRecent() {
        if (this.state.chatLogContainer) {
            this.state.chatLogContainer.scrollTop = 999999;
        }
    }

    private onNewMessage(chat: SingleChatHistory) {
        const newChatLog: Array<IChatMessageProps> = this.state.chatLog;
        newChatLog.push({ name: chat.name, date: chat.date, text: chat.text });
        this.setState({ text: '', chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }
    
    private onNewUsercount(userCount: number) {
        this.setState({ userCount: userCount });
    }

    private onTextChanged(event: object, newText: string): void {
        this.setState({ text: newText });
    } 

    private onSend(): void {
        const authToken: string = document.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`))[1];
        this.state.socket.emit(CHATROOM_EVENTS.PostMessage, { authToken: authToken, text: this.state.text });
    }
    
    render() {

        return (
            <div className="chatroom">
                <div className="chatroom-user" >
                    <div className="chatroom-user-count">
                        <span className="center">{this.state.userCount} users online</span>
                    </div>
                    <RaisedButton
                        className="chatroom-user-list"
                        label="View user list"
                        labelPosition="before"
                        primary={true}
                        onClick={() => { this.props.history.push(`/chat/users`); }}
                        icon={<FontIcon className="fas fa-users" />}
                    />
                </div>
                <div className="scrollable chatroom-messages" >
                    {this.state.chatLog
                        .map((x: IChatMessageProps, index: number) => {
                            return (
                                <ChatMessage
                                    key={index}
                                    name={x.name}
                                    date={x.date}
                                    text={x.text}
                                />
                            );
                        })}
                </div>
                <div className="chatroom-input" >
                    <TextField
                        className="chatroom-input-textfield"
                        value={this.state.text}
                        onChange={this.onTextChanged}
                        hintText="Enter a message"
                    />
                    <RaisedButton
                        className="chatroom-input-enter"
                        label="Send"
                        labelPosition="before"
                        primary={true}
                        disabled={this.state.text === ''}
                        onClick={this.onSend}
                        icon={<FontIcon className="fas fa-chevron-right" />}
                    />
                </div>
            </div>
        );

    }

}

export default withRouter(Chatroom);