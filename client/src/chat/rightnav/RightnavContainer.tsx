import * as io from 'socket.io-client';
import * as Redux from 'redux';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Rightnav from './Rightnav';
import { SwipeState } from '../../../client-server-common/common';
import { CHAT_SERVER_PORT, CHATROOM_EVENTS, ChatroomUser } from '../../../client-server-common/common';
import { ChatroomReduxState } from '../../reducers/main';
import { connect } from 'react-redux';

interface IRightnavContainerProps extends RouteComponentProps<any> { }

interface IRightnavContainerState {
    usersNavRef: React.RefObject<HTMLDivElement>;
    socket: SocketIOClient.Socket;
    users: ChatroomUser[];
    swipeState: SwipeState;
    rightNavWidth: number;
}

interface ReduxStateProps {
    swipeState: SwipeState;
    rightNavWidth: number;
}

interface ReduxDispatchProps {

}

type Props = IRightnavContainerProps & ReduxStateProps & ReduxDispatchProps;

class RightnavContainer extends React.Component<Props, IRightnavContainerState> {

    constructor(props: Props) {
        super(props);
        this.updateNavPosition = this.updateNavPosition.bind(this);
        this.onGetUsers = this.onGetUsers.bind(this);
        this.onUpdateUsers = this.onUpdateUsers.bind(this);
        this.goToRedirect = this.goToRedirect.bind(this);

        const usersNavRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);

        this.state = { 
            usersNavRef: usersNavRef, 
            socket: socket, 
            users: [],
            swipeState: props.swipeState,
            rightNavWidth: props.rightNavWidth
        };
    
        socket.on(CHATROOM_EVENTS.UpdateUsers, this.onUpdateUsers);
        socket.on(CHATROOM_EVENTS.GetAllUsers, this.onGetUsers);
        socket.emit(CHATROOM_EVENTS.GetAllUsers);
    }

    componentDidMount(): void {
        this.updateNavPosition(this.state.swipeState, this.state.rightNavWidth);
    }

    componentWillReceiveProps(newProps: Props): void {
        this.updateNavPosition(newProps.swipeState, newProps.rightNavWidth);
    }

    updateNavPosition(swipeState: SwipeState, rightNavWidth: number): void {
        const divNode: HTMLDivElement = this.state.usersNavRef.current;
        let newRightPosition: number;

        if (swipeState === SwipeState.Left) {
            newRightPosition = -rightNavWidth; 
        } else if (swipeState === SwipeState.Middle) {
            newRightPosition = -rightNavWidth;
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
            <Rightnav
                usersNavRef={this.state.usersNavRef}
                users={this.state.users}
                goToRedirect={this.goToRedirect}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IRightnavContainerProps): ReduxStateProps => {
    const chatroomReduxState: ChatroomReduxState = state.chatroom;
    return {
        swipeState: chatroomReduxState.swipeStateChatroom,
        rightNavWidth: chatroomReduxState.rightNavWidth
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IRightnavContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IRightnavContainerProps>
    (mapStateToProps, mapDispatchToProps)(RightnavContainer));