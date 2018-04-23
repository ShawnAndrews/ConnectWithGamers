const popupS = require('popups');
import * as React from 'react';
import Userlist from "./userlist";
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import { ChatroomUser, CHATROOM_EVENTS, CHAT_SERVER_PORT } from '../../../../client/client-server-common/common';

interface IUserlistContainerProps {
    sidebarActive: boolean;
    history: any;
}

class UserlistContainer extends React.Component<IUserlistContainerProps, any> {

    constructor(props: IUserlistContainerProps) {
        super(props);
        this.onNewUser = this.onNewUser.bind(this);
        this.goBack = this.goBack.bind(this);
        this.state = { userlist: [] };

        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        socket.on(CHATROOM_EVENTS.User, this.onNewUser);
        socket.emit(CHATROOM_EVENTS.Usercount);
    }

    goBack(): void {
        this.props.history.goBack();
    }

    onNewUser(newUser: ChatroomUser): void {
        const newUserlist: ChatroomUser[] = this.state.userlist;
        newUserlist.push(newUser);
        this.setState({ userlist: newUserlist });
    }

    render() {
        return (
            <Userlist
                sidebarActive={this.props.sidebarActive}
                userlist={this.state.userlist}
                goBack={this.goBack}
            />
        );
    }

}

export default withRouter(UserlistContainer);