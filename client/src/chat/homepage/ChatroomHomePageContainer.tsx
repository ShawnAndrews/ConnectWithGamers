const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import * as ChatroomService from '../../service/chatroom/main';
import { AUTH_TOKEN_NAME, CHATROOM_EVENTS, CHAT_SERVER_PORT, ChatHistoryResponse, SingleChatHistory, ChatroomAttachmentResponse } from '../../../../client/client-server-common/common';
import { popupBasic } from '../../common';
import ChatroomHomePage from './ChatroomHomePage';

interface IChatroomHomePageContainerProps extends RouteComponentProps<any> {
    sidebarWidth: number;
    movedXPos: number;
    expanded: boolean;
} 

class ChatroomHomePageContainer extends React.Component<IChatroomHomePageContainerProps, any> {

    constructor(props: IChatroomHomePageContainerProps) {
        super(props);

        const chatroomHomePageContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

        this.state = { chatroomHomePageContainerRef: chatroomHomePageContainerRef, sidebarWidth: props.sidebarWidth, chatroomContainerXPos: props.expanded ? `${props.sidebarWidth}px` : '0px' };
    }

    componentDidMount(): void {
        const divNode: HTMLDivElement = this.state.chatroomHomePageContainerRef.current;
        divNode.style.left = this.state.chatroomContainerXPos;
        if (this.state.chatroomContainerXPos === `${this.state.sidebarWidth}px`) {
            this.setState({ chatroomContainerXPos: '0px' });
        }
    }

    componentWillReceiveProps(newProps: IChatroomHomePageContainerProps): void {
        const divNode: HTMLDivElement = this.state.chatroomHomePageContainerRef.current;
        let newChatroomContainerXPos: string = parseInt( this.state.chatroomContainerXPos, 10 ) + newProps.movedXPos + "px";
        divNode.style.left = newChatroomContainerXPos;
    }

    render() {
        return (
            <ChatroomHomePage
                chatroomHomePageContainerRef={this.state.chatroomHomePageContainerRef}
            />
        );
    }

}

export default withRouter(ChatroomHomePageContainer);