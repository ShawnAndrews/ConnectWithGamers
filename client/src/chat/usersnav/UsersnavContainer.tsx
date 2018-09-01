import * as io from 'socket.io-client';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Usersnav from './Usersnav';
import { SwipeState } from '../ChatroomMenuContainer';
import { CHAT_SERVER_PORT, CHATROOM_EVENTS, ChatroomUser } from '../../../client-server-common/common';

interface IUsersnavContainerProps extends RouteComponentProps<any> {
    usersbarWidth: number;
    swipeState: SwipeState;
}

class UsersnavContainer extends React.Component<IUsersnavContainerProps, any> {

    constructor(props: IUsersnavContainerProps) {
        super(props);
        this.onGetUsers = this.onGetUsers.bind(this);
        this.onUpdateUsers = this.onUpdateUsers.bind(this);
        this.goToRedirect = this.goToRedirect.bind(this);

        const usersNavRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);

        this.state = { usersNavRef: usersNavRef, socket: socket, users: [] };
    
        socket.on(CHATROOM_EVENTS.UpdateUsers, this.onUpdateUsers);
        socket.on(CHATROOM_EVENTS.GetAllUsers, this.onGetUsers);
        socket.emit(CHATROOM_EVENTS.GetAllUsers);
    }

    componentWillReceiveProps(newProps: IUsersnavContainerProps): void {
        const divNode: HTMLDivElement = this.state.usersNavRef.current;
        let newRightPosition: number;

        if (newProps.swipeState === SwipeState.Left) {
            newRightPosition = -newProps.usersbarWidth; 
        } else if (newProps.swipeState === SwipeState.Middle) {
            newRightPosition = -newProps.usersbarWidth;
        } else {
            newRightPosition = 0;
        }
        
        divNode.style.right = `${newRightPosition}px`;
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
            <Usersnav
                usersNavRef={this.state.usersNavRef}
                users={this.state.users}
                goToRedirect={this.goToRedirect}
            />
        );
    }

}

export default withRouter(UsersnavContainer);