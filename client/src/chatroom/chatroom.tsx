import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import People from 'material-ui/svg-icons/social/people';
import Spinner from '../loader/spinner';
import ChatMessage, { IChatMessageProps } from './chatmessage';
import { AUTH_TOKEN_NAME, CHATROOM_EVENTS, CHAT_SERVER_PORT, ChatHistoryResponse, SingleChatHistory } from '../../../client/client-server-common/common';
import { popupBasic } from './../common';

interface IChatroomProps {
    history: any;
}

class Chatroom extends React.Component<IChatroomProps, any> {

    constructor(props: IChatroomProps) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onNewMessageHistory = this.onNewMessageHistory.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.onNewUsercount = this.onNewUsercount.bind(this);
        this.scrollChatToMostRecent = this.scrollChatToMostRecent.bind(this);
        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        this.state = { text: '', chatLog: [], userCountLoading: true, messagesLoading: true, socket: socket };
        socket.on(CHATROOM_EVENTS.Message, this.onNewMessage);
        socket.on(CHATROOM_EVENTS.Usercount, this.onNewUsercount);
        socket.on(CHATROOM_EVENTS.MessageHistory, this.onNewMessageHistory);
    }

    componentDidMount(): void {
        this.setState({ chatLogContainer: document.querySelector('.chatroom-messages') });
    }

    private scrollChatToMostRecent() {
        if (this.state.chatLogContainer) {
            this.state.chatLogContainer.scrollTop = 999999;
        }
    }

    private onNewMessageHistory(chats: ChatHistoryResponse) {
        const newChatLog: Array<IChatMessageProps> = this.state.chatLog;
        for (let i = 0; i < chats.name.length; i++) {
            const chat: SingleChatHistory = { name: chats.name[i], date: new Date(chats.date[i]), text: chats.text[i], image: chats.image[i] };
            newChatLog.push(chat);
        }
        this.setState({ text: '', messagesLoading: false, chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }

    private onNewMessage(chat: SingleChatHistory) {
        const newChatLog: Array<IChatMessageProps> = this.state.chatLog;
        newChatLog.push({ name: chat.name, date: chat.date, text: chat.text, image: chat.image });
        this.setState({ text: '', chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }
    
    private onNewUsercount(userCount: number) {
        this.setState({ userCountLoading: false, userCount: userCount });
    }

    private onTextChanged(event: object, newText: string): void {
        this.setState({ text: newText });
    } 

    private onSend(event: any): void {
        if (event.key === `Enter`) {
            const cookieMatch: string[] = document.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));
            if (cookieMatch) {
                const authToken: string = cookieMatch[1];
                this.state.socket.emit(CHATROOM_EVENTS.PostMessage, { authToken: authToken, text: this.state.text });   
            } else {
                popupBasic(`Login session expired. Please login again.`, () => {
                    this.props.history.push(`/account/login`);
                });
            }
        }
    }
    
    render() {
        const MenuList = (props: any) => (
            <IconMenu
              className="appbar-menu"
              {...props}
              iconButtonElement={
                <IconButton><MoreVertIcon/></IconButton>
              }
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            >
              <MenuItem className="appbar-menu-item" primaryText="User List" onClick={() => { this.props.history.push(`/chat/users`); }} />
              <Divider />
              <MenuItem className="appbar-menu-item" primaryText={this.state.userCountLoading ? "Loading users..." : `${this.state.userCount} users online`} leftIcon={<People/>} />
            </IconMenu>
          );

        return (
            <div className="chatroom">
                <AppBar
                    className="chatroom-appbar"
                    title="Chatroom"
                    iconElementLeft={<MenuList />}
                />
                <div className="scrollable chatroom-messages" >
                    {this.state.messagesLoading && 
                        <div className="chatroom-messages-loading">
                            <Spinner loadingMsg="Loading chat..." />
                        </div>}
                    {!this.state.messagesLoading &&
                        this.state.chatLog.map((x: IChatMessageProps, index: number) => {
                            return (
                                <ChatMessage
                                    key={index}
                                    name={x.name}
                                    date={x.date}
                                    text={x.text}
                                    image={x.image}
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
                        onKeyPress={this.onSend}
                    />
                </div>
            </div>
        );

    }

}

export default withRouter(Chatroom);