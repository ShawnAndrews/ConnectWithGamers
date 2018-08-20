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
        this.onNewUser = this.onNewUser.bind(this);
        this.goBack = this.goBack.bind(this);

        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        const userlistContainerRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
        this.state = { userlistContainerRef: userlistContainerRef, sidebarWidth: props.sidebarWidth, userlistContainerXPos: props.expanded ? `${props.sidebarWidth}px` : '0px', userlist: [] };

        socket.on(CHATROOM_EVENTS.User, this.onNewUser);
        socket.emit(CHATROOM_EVENTS.Usercount);
    }

    componentDidMount(): void {
        const divNode: HTMLDivElement = this.state.userlistContainerRef.current;
        divNode.style.left = this.state.userlistContainerXPos;
        if (this.state.userlistContainerXPos === `${this.state.sidebarWidth}px`) {
            this.setState({ userlistContainerXPos: '0px' });
        }
    }

    componentWillReceiveProps(newProps: IUserlistContainerProps): void {
        const divNode: HTMLDivElement = this.state.userlistContainerRef.current;
        let newUserlistContainerXPos: string = parseInt( this.state.userlistContainerXPos, 10 ) + newProps.movedXPos + "px";
        divNode.style.left = newUserlistContainerXPos;
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
                userlist={this.state.userlist}
                goBack={this.goBack}
                userlistContainerRef={this.state.userlistContainerRef}
            />
        );
    }

}

export default withRouter(UserlistContainer);