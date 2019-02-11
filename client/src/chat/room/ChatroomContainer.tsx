import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import { AUTH_TOKEN_NAME, CHATROOM_EVENTS, CHAT_SERVER_PORT, ChatHistoryResponse, SingleChatHistory } from '../../../../client/client-server-common/common';
import Chatroom from './Chatroom';

interface IChatroomContainerProps extends RouteComponentProps<any> {
    chatroomid: number;
}

interface IChatroomContainerState {
    chatroomid: number;
    chatLog: Array<SingleChatHistory>;
    messagesLoading: boolean;
    socket: SocketIOClient.Socket;
    chatLogContainer: any;
}

class ChatroomContainer extends React.Component<IChatroomContainerProps, IChatroomContainerState> {

    constructor(props: IChatroomContainerProps) {
        super(props);
        this.onSendCallback = this.onSendCallback.bind(this);
        this.onNewMessageHistory = this.onNewMessageHistory.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.scrollChatToMostRecent = this.scrollChatToMostRecent.bind(this);

        const socket: SocketIOClient.Socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);

        this.state = { 
            chatroomid: props.chatroomid,
            chatLog: [], 
            messagesLoading: true, 
            socket: socket,
            chatLogContainer: undefined
        };

        socket.on(CHATROOM_EVENTS.Message, this.onNewMessage);
        socket.on(CHATROOM_EVENTS.MessageHistory, this.onNewMessageHistory);
        socket.emit(CHATROOM_EVENTS.GetMessageHistory, { chatroomid: props.chatroomid });
        socket.emit(CHATROOM_EVENTS.GetAllUsers);
    }

    componentDidMount(): void {
        this.setState({
            chatLogContainer: document.querySelector('.chatroom-messages-container') 
        });
    }

    componentWillReceiveProps(newProps: IChatroomContainerProps): void {
        if (newProps.chatroomid !== this.state.chatroomid) {
            this.setState({ chatroomid: newProps.chatroomid, chatLog: [], messagesLoading: true }, () => {
                this.state.socket.emit(CHATROOM_EVENTS.GetMessageHistory, { chatroomid: newProps.chatroomid });
            });
        }
    }

    scrollChatToMostRecent(): void {
        if (this.state.chatLogContainer) {
            this.state.chatLogContainer.scrollTop = 99999;
        }
    }

    onNewMessageHistory(chats: ChatHistoryResponse): void {
        const newChatLog: Array<SingleChatHistory> = this.state.chatLog;
        for (let i = 0; i < chats.name.length; i++) {
            const chat: SingleChatHistory = { accountId: chats.accountId[i], name: chats.name[i], date: new Date(chats.date[i]), text: chats.text[i], profile: chats.profile[i], profileFileExtension: chats.profile_file_extension[i], attachment: chats.attachment[i], attachmentFileExtension: chats.attachment_file_extension[i], chatroomId: this.state.chatroomid, chatroomMessageId: chats.chatroomMessageId[i] };
            newChatLog.push(chat);
        }
        this.setState({ messagesLoading: false, chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }

    onNewMessage(chat: SingleChatHistory): void {
        const newChatLog: Array<SingleChatHistory> = this.state.chatLog;
        newChatLog.push({ accountId: chat.accountId, name: chat.name, date: new Date(chat.date), text: chat.text, profile: chat.profile, profileFileExtension: chat.profileFileExtension, attachment: chat.attachment, attachmentFileExtension: chat.attachmentFileExtension, chatroomId: this.state.chatroomid, chatroomMessageId: chat.chatroomMessageId });
        this.setState({ chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }

    onSendCallback(text: string, attachmentBase64: string, attachmentFileExtension: string): void {
        if (text !== "" || attachmentBase64) {
            const cookieMatch: string[] = document.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));
            let authToken: string;
            if (cookieMatch) {
                authToken = cookieMatch[1];
            } else {
                authToken = undefined;
            }
            this.state.socket.emit(CHATROOM_EVENTS.PostMessage, { authToken: authToken, text: text, attachmentBase64: attachmentBase64, attachmentFileExtension: attachmentFileExtension, chatroomId: this.state.chatroomid });
        }
    }

    render() {
        return (
            <Chatroom
                messagesLoading={this.state.messagesLoading}
                chatLog={this.state.chatLog}
                onSendCallback={this.onSendCallback}
            />
        );
    }

}

export default withRouter(ChatroomContainer);