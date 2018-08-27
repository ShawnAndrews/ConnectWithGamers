const popupS = require('popups');
import * as React from 'react';
import Userlist from "./userlist";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import { ChatroomUser, CHATROOM_EVENTS, CHAT_SERVER_PORT } from '../../../../client/client-server-common/common';

interface IUserlistContainerProps extends RouteComponentProps<any> {
    sidebarWidth: number;
    movedXPos: number;
    expanded: boolean;
}

class UserlistContainer extends React.Component<IUserlistContainerProps, any> {

    constructor(props: IUserlistContainerProps) {
        super(props);
        this.onUsers = this.onUsers.bind(this);
        this.onSearch = this.onSearch.bind(this);

        const paramUser: string = this.props.match.params.user;
        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        const userlistContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        this.state = { socket: socket, userlistContainerRef: userlistContainerRef, sidebarWidth: props.sidebarWidth, userlistContainerXPos: props.expanded ? `${props.sidebarWidth}px` : '0px', userlist: [], paramUser: paramUser, searched: paramUser ? true : false };
        
        socket.on(CHATROOM_EVENTS.Users, this.onUsers);
    }

    componentDidMount(): void {
        const divNode: HTMLDivElement = this.state.userlistContainerRef.current;
        divNode.style.left = this.state.userlistContainerXPos;
        if (this.state.userlistContainerXPos === `${this.state.sidebarWidth}px`) {
            this.setState({ userlistContainerXPos: '0px' });
        }
        if (this.state.paramUser) {
            this.state.socket.emit(CHATROOM_EVENTS.SearchUsers, { filter: this.state.paramUser });
        }
    }

    componentWillReceiveProps(newProps: IUserlistContainerProps): void {
        const divNode: HTMLDivElement = this.state.userlistContainerRef.current;
        let newUserlistContainerXPos: string = parseInt( this.state.userlistContainerXPos, 10 ) + newProps.movedXPos + "px";
        divNode.style.left = newUserlistContainerXPos;
    }

    onUsers(users: ChatroomUser[]): void {
        const newUserlist: ChatroomUser[] = users;
        this.setState({ userlist: newUserlist, searched: true });
    }

    onSearch(event: React.KeyboardEvent<HTMLInputElement>): void {
        // on enter
        if (event.key === 'Enter') {
            this.state.socket.emit(CHATROOM_EVENTS.SearchUsers, { filter: event.currentTarget.value });
        }
    }

    render() {
        return (
            <Userlist
                searched={this.state.searched}
                userlist={this.state.userlist}
                userlistContainerRef={this.state.userlistContainerRef}
                onSearch={this.onSearch}
            />
        );
    }

}

export default withRouter(UserlistContainer);