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
import { ResponseModel, ChatHistoryResponse, SingleChatHistory } from '../../../client/client-server-common/common';

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
        const socket = io(`${window.location.hostname}:81`);
        this.state = { text: '', chatLog: [], userCount: 0, socket: socket };
        socket.on('new-message', this.onNewMessage);
        socket.on('new-usercount', this.onNewUsercount);
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
        console.log(`New message! ${JSON.stringify(chat)}`);

        const newChatLog: Array<IChatMessageProps> = this.state.chatLog;
        newChatLog.push({ name: chat.name, date: chat.date, text: chat.text, isChatLogEmpty: false });
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
        const authToken: string = document.cookie.match(new RegExp('authToken=([^;]+)'))[1];
        this.state.socket.emit('post-message', { authToken: authToken, text: this.state.text });
    }
    
    render() {

        const settingStyle = {
            floatingLabel: { 
                'color': 'rgba(255,255,255,0.35)' 
            },
            floatingLabelFocus: { 
                'color': 'whitesmoke'
            },
            input: { 
                'color': 'whitesmoke'
            },
            hint: { 
                'color': 'whitesmoke'
            },
            underlineFocus: {
                'border-bottom': '2px solid rgba(255,255,255,0.2)'
            }
        };

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
                                    isChatLogEmpty={false}
                                />
                            );
                        })}
                    {this.state.chatLog.length === 0 && 
                        <ChatMessage
                            isChatLogEmpty={true} 
                        />}
                </div>
                <div className="chatroom-input" >
                    <TextField
                        className="chatroom-input-textfield"
                        inputStyle={settingStyle.input}
                        hintStyle={settingStyle.hint}
                        underlineFocusStyle={settingStyle.underlineFocus}
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