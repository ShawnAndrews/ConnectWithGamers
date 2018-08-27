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
        this.onClickCogIcon = this.onClickCogIcon.bind(this);

        const usersPageActive: boolean = (props.location.pathname === '/chat/users/');
        const cogPageActive: boolean = (props.location.pathname === '/chat/settings/');

        this.state = { title: this.getPathTitle(props), usersPageActive: usersPageActive, cogPageActive: cogPageActive };
    }

    componentWillReceiveProps(newProps: ITopnavContainerProps): void {
        const usersPageActive: boolean = (newProps.location.pathname === '/chat/users/');
        this.setState({ title: this.getPathTitle(newProps), usersPageActive: usersPageActive });
    }

    getPathTitle(props: ITopnavContainerProps): string {
        const path: string = props.history.location.pathname;
        
        if (path === `/chat` || path === `/chat/`) {
            return "Chatroom";
        } else if (path.startsWith(`/chat/users`)) {
            return "User List";
        } else if (path.startsWith(`/chat/settings`)) {
            return "Settings";
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

    onClickCogIcon(): void {
        this.setState({ cogPageActive: !this.state.cogPageActive }, () => {
            if (this.state.cogPageActive) {
                this.props.history.push('/chat/settings/');
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
                cogPageActive={this.state.cogPageActive}
                onClickUsersIcon={this.onClickUsersIcon}
                onClickCogIcon={this.onClickCogIcon}
            />
        );
    }

}

export default withRouter(TopnavContainer);