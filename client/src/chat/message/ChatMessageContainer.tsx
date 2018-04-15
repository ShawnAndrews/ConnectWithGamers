const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as AccountService from '../../service/account/main';
import { EmailVerifyResponse } from '../../../../client/client-server-common/common';
import ChatMessage from './chatmessage';

export interface IChatMessageContainerProps {
    name: string;
    date: Date;
    text: string;
    image: string;
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
                timeVisible={this.state.timeVisible}
                changeTimeVisibility={this.changeTimeVisibility}
            />
        );
    }

}

export default withRouter(ChatMessageContainer);