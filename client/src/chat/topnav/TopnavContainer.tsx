import * as React from 'react';
import Topnav from './Topnav';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';

interface ITopnavContainerProps extends RouteComponentProps<any> {
    
}

class TopnavContainer extends React.Component<ITopnavContainerProps, any> {

    constructor(props: ITopnavContainerProps) {
        super(props);
        this.getPathTitle = this.getPathTitle.bind(this);
        this.onClickUsersIcon = this.onClickUsersIcon.bind(this);

        const usersPageActive: boolean = (props.location.pathname === '/chat/users/');

        this.state = { title: this.getPathTitle(props), usersPageActive: usersPageActive };
    }

    componentWillReceiveProps(newProps: ITopnavContainerProps): void {
        const usersPageActive: boolean = (newProps.location.pathname === '/chat/users/');
        this.setState({ title: this.getPathTitle(newProps), usersPageActive: usersPageActive });
    }

    getPathTitle(props: ITopnavContainerProps): string {
        const path: string = props.history.location.pathname;
        
        if (path === `/chat`) {
            return "Chatroom";
        } else if (path.startsWith(`/chat/users`)) {
            return "User List";
        } else {
            let title: string = "Title Error";
            CHATROOMS.map((chatroomInfo: ChatroomInfo) => {
                if (path.startsWith(chatroomInfo.redirect)) {
                    title = chatroomInfo.name;
                }
            });
            return title;
        }

    }

    onClickUsersIcon(): void {
        this.setState({ usersPageActive: !this.state.usersPageActive }, () => {
            if (this.state.usersPageActive) {
                this.props.history.push('/chat/users/');
            } else {
                this.props.history.goBack();
            }
        });
    }

    render() {
        return (
            <Topnav
                title={this.state.title}
                usersPageActive={this.state.usersPageActive}
                onClickUsersIcon={this.onClickUsersIcon}
            />
        );
    }

}

export default withRouter(TopnavContainer);