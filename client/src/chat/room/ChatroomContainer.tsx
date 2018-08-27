const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import * as ChatroomService from '../../service/chatroom/main';
import { AUTH_TOKEN_NAME, CHATROOM_EVENTS, CHAT_SERVER_PORT, ChatHistoryResponse, SingleChatHistory, ChatroomAttachmentResponse } from '../../../../client/client-server-common/common';
import { popupBasic } from '../../common';
import Chatroom from './chatroom';

interface IChatroomContainerProps extends RouteComponentProps<any> {
    chatroomid: number;
    sidebarWidth: number;
    movedXPos: number;
    expanded: boolean;
} 

class ChatroomContainer extends React.Component<IChatroomContainerProps, any> {

    constructor(props: IChatroomContainerProps) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onNewMessageHistory = this.onNewMessageHistory.bind(this);
        this.onNewMessage = this.onNewMessage.bind(this);
        this.scrollChatToMostRecent = this.scrollChatToMostRecent.bind(this);
        this.handleAttachmentUpload = this.handleAttachmentUpload.bind(this);

        const chatroomContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);

        this.state = { chatroomContainerRef: chatroomContainerRef, chatroomid: props.chatroomid, sidebarWidth: props.sidebarWidth, chatroomContainerXPos: props.expanded ? `${props.sidebarWidth}px` : '0px', attachmentLoading: false, text: '', chatLog: [], messagesLoading: true, socket: socket };

        socket.on(CHATROOM_EVENTS.Message, this.onNewMessage);
        socket.on(CHATROOM_EVENTS.MessageHistory, this.onNewMessageHistory);
        socket.emit(CHATROOM_EVENTS.GetMessageHistory, { chatroomid: props.chatroomid });
    }

    componentDidMount(): void {
        this.setState({ chatLogContainer: document.querySelector('.chatroom-messages') });
        const divNode: HTMLDivElement = this.state.chatroomContainerRef.current;
        divNode.style.left = this.state.chatroomContainerXPos;
        if (this.state.chatroomContainerXPos === `${this.state.sidebarWidth}px`) {
            this.setState({ chatroomContainerXPos: '0px' });
        }
    }

    componentWillReceiveProps(newProps: IChatroomContainerProps): void {
        const divNode: HTMLDivElement = this.state.chatroomContainerRef.current;
        let newChatroomContainerXPos: string = parseInt( this.state.chatroomContainerXPos, 10 ) + newProps.movedXPos + "px";
        divNode.style.left = newChatroomContainerXPos;
        if (newProps.chatroomid !== this.state.chatroomid) {
            this.setState({ chatroomid: newProps.chatroomid, chatLog: [], messagesLoading: true }, () => {
                this.state.socket.emit(CHATROOM_EVENTS.GetMessageHistory, { chatroomid: newProps.chatroomid });
            });
        }
    }

    scrollChatToMostRecent(): void {
        if (this.state.chatLogContainer) {
            this.state.chatLogContainer.scrollTop = 999999;
        }
    }

    onNewMessageHistory(chats: ChatHistoryResponse): void {
        const newChatLog: Array<SingleChatHistory> = this.state.chatLog;
        for (let i = 0; i < chats.name.length; i++) {
            const chat: SingleChatHistory = { name: chats.name[i], date: new Date(chats.date[i]), text: chats.text[i], image: chats.image[i], attachment: chats.attachment[i], chatroomid: this.state.chatroomid };
            newChatLog.push(chat);
        }
        this.setState({ text: '', messagesLoading: false, chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }

    onNewMessage(chat: SingleChatHistory): void {
        const newChatLog: Array<SingleChatHistory> = this.state.chatLog;
        newChatLog.push({ name: chat.name, date: chat.date, text: chat.text, image: chat.image, attachment: chat.attachment, chatroomid: this.state.chatroomid });
        this.setState({ text: '', chatLog: newChatLog }, () => {
            this.scrollChatToMostRecent();
        });
    }

    onTextChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ text: event.currentTarget.value });
    } 

    onKeyPress(event: any): void {
        if (event.key === `Enter` && !this.state.attachmentLoading) {
            const cookieMatch: string[] = document.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));
            if (cookieMatch) {
                this.onSend();   
            } else {
                popupBasic(`Login session expired. Please login again.`, () => {
                    this.props.history.push(`/account/login`);
                });
            }
        }
    }

    onSend(): void {
        if (this.state.text !== "" || this.state.attachmentLink !== "") {
            const cookieMatch: string[] = document.cookie.match(new RegExp(`${AUTH_TOKEN_NAME}=([^;]+)`));
            let authToken: string;
            if (cookieMatch) {
                authToken = cookieMatch[1];
            } else {
                authToken = undefined;
            }
            this.state.socket.emit(CHATROOM_EVENTS.PostMessage, { authToken: authToken, text: this.state.text, attachment: this.state.attachmentLink, chatroomid: this.state.chatroomid });
            this.setState({ attachmentLink: undefined });
        }
    }

    handleAttachmentUpload(event: any): void {

        const getBase64 = (file: any) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        getBase64(event.target.files[0])
        .then((imageBase64: string) => {
            this.setState({ attachmentLoading: true }, () => {
                ChatroomService.httpUploadAttachment(imageBase64)
                    .then( (response: ChatroomAttachmentResponse) => {
                        this.setState({ attachmentLoading: false, attachmentLink: response.link });
                    })
                    .catch( (error: string) => {
                        this.setState({ attachmentLoading: false });
                        popupS.modal({ content: `<div>• ${error}</div>` });
                    });
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>Error converting image to base 64. ${error}</div>` });
        });

    }

    render() {
        return (
            <Chatroom
                attachmentLink={this.state.attachmentLink}
                attachmentLoading={this.state.attachmentLoading}
                messagesLoading={this.state.messagesLoading}
                text={this.state.text}
                chatLog={this.state.chatLog}
                onTextChanged={this.onTextChanged}
                onKeyPress={this.onKeyPress}
                onSend={this.onSend}
                handleAttachmentUpload={this.handleAttachmentUpload}
                chatroomContainerRef={this.state.chatroomContainerRef}
            />
        );
    }

}

export default withRouter(ChatroomContainer);