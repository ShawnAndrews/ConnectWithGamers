import * as React from 'react';
import Userlist from "./Userlist";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import { ChatroomUser, CHATROOM_EVENTS, CHAT_SERVER_PORT } from '../../../../client/client-server-common/common';

interface IUserlistContainerProps extends RouteComponentProps<any> { }

interface IUserlistContainerState {
    socket: SocketIOClient.Socket;
    userlist: ChatroomUser[];
    paramUser: string;
    searched: boolean;
}

class UserlistContainer extends React.Component<IUserlistContainerProps, IUserlistContainerState> {

    constructor(props: IUserlistContainerProps) {
        super(props);
        this.onUsers = this.onUsers.bind(this);
        this.onSearch = this.onSearch.bind(this);

        const paramUser: string = this.props.match.params.user;
        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        this.state = { 
            socket: socket, 
            userlist: [], 
            paramUser: paramUser, 
            searched: paramUser ? true : false 
        };
        
        socket.on(CHATROOM_EVENTS.Users, this.onUsers);
    }

    componentDidMount(): void {
        if (this.state.paramUser) {
            this.state.socket.emit(CHATROOM_EVENTS.SearchUsers, { filter: this.state.paramUser });
        }
    }

    onUsers(users: ChatroomUser[]): void {
        const newUserlist: ChatroomUser[] = users;
        this.setState({ userlist: newUserlist, searched: true });
    }

    onSearch(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            this.state.socket.emit(CHATROOM_EVENTS.SearchUsers, { filter: event.currentTarget.value });
        }
    }

    render() {
        return (
            <Userlist
                searched={this.state.searched}
                userlist={this.state.userlist}
                onSearch={this.onSearch}
            />
        );
    }

}

export default withRouter(UserlistContainer);