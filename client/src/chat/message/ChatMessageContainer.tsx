const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as AccountService from '../../service/account/main';
import { EmailVerifyResponse } from '../../../../client/client-server-common/common';
import ChatMessage from './chatmessage';
import { MessageSide } from '../room/chatroom';

export interface IChatMessageContainerProps extends RouteComponentProps<any> {
    name: string;
    date: Date;
    text: string;
    image: string;
    attachment: string;
    side: MessageSide;
    repeat: boolean;
}

class ChatMessageContainer extends React.Component<IChatMessageContainerProps, any> {

    constructor(props: IChatMessageContainerProps) {
        super(props);
        this.changeTimeVisibility = this.changeTimeVisibility.bind(this);
        this.state = { timeVisible: false };
    }

    changeTimeVisibility(): void {
        this.setState({ timeVisible: !this.state.timeVisible });
    }

    render() {
        return (
            <ChatMessage
                name={this.props.name}
                date={this.props.date}
                text={this.props.text}
                image={this.props.image}
                attachment={this.props.attachment}
                timeVisible={this.state.timeVisible}
                side={this.props.side}
                repeat={this.props.repeat}
                changeTimeVisibility={this.changeTimeVisibility}
            />
        );
    }

}

export default withRouter(ChatMessageContainer);