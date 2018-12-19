import * as io from 'socket.io-client';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Rightnav from './Rightnav';
import { CHAT_SERVER_PORT, CHATROOM_EVENTS, ChatroomUser } from '../../../client-server-common/common';

export enum IndicatorStatus {
    Green, Yellow, Red
}

interface IRightnavContainerProps extends RouteComponentProps<any> { }

interface IRightnavContainerState {
    socket: SocketIOClient.Socket;
    users: ChatroomUser[];
}

class RightnavContainer extends React.Component<IRightnavContainerProps, IRightnavContainerState> {

    constructor(props: IRightnavContainerProps) {
        super(props);
        this.onGetUsers = this.onGetUsers.bind(this);
        this.onUpdateUsers = this.onUpdateUsers.bind(this);
        this.goToRedirect = this.goToRedirect.bind(this);

        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);

        this.state = { 
            socket: socket, 
            users: []
        };
    
        socket.on(CHATROOM_EVENTS.UpdateUsers, this.onUpdateUsers);
        socket.on(CHATROOM_EVENTS.GetAllUsers, this.onGetUsers);
        socket.emit(CHATROOM_EVENTS.GetAllUsers);
    }

    onUpdateUsers(): void {
        this.state.socket.emit(CHATROOM_EVENTS.GetAllUsers);
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    onGetUsers(users: ChatroomUser[]): void {
        this.setState({ users: users });
    }

    render() {
        
        return (
            <Rightnav
                users={this.state.users}
                goToRedirect={this.goToRedirect}
            />
        );
    }

}

export default withRouter(RightnavContainer);