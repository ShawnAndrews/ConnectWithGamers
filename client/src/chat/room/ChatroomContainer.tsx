import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import ChatMessageContainer, { IChatMessageContainerProps } from '../message/ChatMessageContainer';
import { AUTH_TOKEN_NAME, CHATROOM_EVENTS, CHAT_SERVER_PORT, ChatHistoryResponse, SingleChatHistory } from '../../../../client/client-server-common/common';
import { popupBasic } from '../../common';
import Chatroom from './chatroom';

interface IChatroomContainerProps {
    history: any;
    match?: any;
}

class ChatroomContainer extends React.Component<IChatroomContainerProps, any> {

    constructor(props: IChatroomContainerProps) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onNewMessageHistory = this.onNewMessageHistory.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.goToUsers = this.goToUsers.bind(this);
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

    goToUsers(): void {
        this.props.history.push(`/chat/users`);
    }

    scrollChatToMostRecent(): void {
        if (this.state.chatLogContainer) {
            this.state.chatLogContainer.scrollTop = 999999;
        }
    }

    onNewMessageHistory(chats: ChatHistoryResponse): void {
        const newChatLog: Array<IChatMessageContainerProps> = this.state.chatLog;
        for (let i = 0; i < chats.name.length; i++) {
            const chat: SingleChatHistory = { name: chats.name[i], date: new Date(chats.date[i]), text: chats.text[i], image: chats.image[i] };
            newChatLog.push(chat);
        }
        this.setState({ text: '', messagesLoading: false, chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }

    onNewMessage(chat: SingleChatHistory): void {
        const newChatLog: Array<IChatMessageContainerProps> = this.state.chatLog;
        newChatLog.push({ name: chat.name, date: chat.date, text: chat.text, image: chat.image });
        this.setState({ text: '', chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }
    
    onNewUsercount(userCount: number): void {
        this.setState({ userCountLoading: false, userCount: userCount });
    }

    onTextChanged(event: object, newText: string): void {
        this.setState({ text: newText });
    } 

    onSend(event: any): void {
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
        return (
            <Chatroom
                userCount={this.state.userCount}
                messagesLoading={this.state.messagesLoading}
                userCountLoading={this.state.userCountLoading}
                text={this.state.text}
                chatLog={this.state.chatLog}
                onTextChanged={this.onTextChanged}
                onNewUsercount={this.onNewUsercount}
                goToUsers={this.goToUsers}
                onSend={this.onSend}
            />
        );
    }

}

export default withRouter(ChatroomContainer);