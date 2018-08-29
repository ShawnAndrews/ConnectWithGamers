const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import * as ChatroomService from '../../service/chatroom/main';
import { AUTH_TOKEN_NAME, CHATROOM_EVENTS, CHAT_SERVER_PORT, ChatHistoryResponse, SingleChatHistory, ChatroomAttachmentResponse } from '../../../../client/client-server-common/common';
import { popupBasic } from '../../common';
import ChatroomHomePage from './ChatroomHomePage';
import { SwipeState } from '../ChatroomMenuContainer';

interface IChatroomHomePageContainerProps extends RouteComponentProps<any> {

} 

class ChatroomHomePageContainer extends React.Component<IChatroomHomePageContainerProps, any> {

    constructor(props: IChatroomHomePageContainerProps) {
        super(props);

        this.state = {  };
    }

    render() {
        return (
            <ChatroomHomePage/>
        );
    }

}

export default withRouter(ChatroomHomePageContainer);