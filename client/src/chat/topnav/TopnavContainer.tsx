import * as React from 'react';
import Topnav from './Topnav';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';

interface ITopnavContainerProps extends RouteComponentProps<any> { }

interface ITopnavContainerState {
    title: string;
    searchText: string;
    anchorEl: HTMLElement;
}

class TopnavContainer extends React.Component<ITopnavContainerProps, ITopnavContainerState> {

    constructor(props: ITopnavContainerProps) {
        super(props);
        this.getPathTitle = this.getPathTitle.bind(this);
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onMenuClose = this.onMenuClose.bind(this);
        this.onCreateEmoteLinkClick = this.onCreateEmoteLinkClick.bind(this);
        this.onViewEmotesLinkClick = this.onViewEmotesLinkClick.bind(this);
        this.onUserlistLinkClick = this.onUserlistLinkClick.bind(this);
        
        this.state = { 
            title: this.getPathTitle(props),
            searchText: '',
            anchorEl: null
        };
    }

    componentWillReceiveProps(newProps: ITopnavContainerProps): void {
        this.setState({ title: this.getPathTitle(newProps) });
    }

    getPathTitle(props: ITopnavContainerProps): string {
        const path: string = props.history.location.pathname;
        
        if (path.startsWith(`/chat/users`)) {
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

    handleSearchKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key === 'Enter') {
            this.props.history.push(`/chat/users${this.state.searchText === '' ? this.state.searchText : `?search=${this.state.searchText}`}`);
        }
    }

    onSearchTextChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchText: e.target.value });
    }

    onMenuClick(e: React.MouseEvent<HTMLElement>): void {
        this.setState({ anchorEl: e.currentTarget });
    }

    onMenuClose(): void {
        this.setState({ anchorEl: null });
    }

    onCreateEmoteLinkClick(): void {
        this.props.history.push('/chat/emotes/create');
    }

    onViewEmotesLinkClick(): void {
        this.props.history.push('/chat/emotes');
    }

    onUserlistLinkClick(): void {
        this.props.history.push('/chat/users');
    }

    render() {
        return (
            <Topnav
                title={this.state.title}
                anchorEl={this.state.anchorEl}
                onSearchTextChange={this.onSearchTextChange}
                handleSearchKeyPress={this.handleSearchKeyPress}
                onMenuClick={this.onMenuClick}
                onMenuClose={this.onMenuClose}
                onCreateEmoteLinkClick={this.onCreateEmoteLinkClick}
                onViewEmotesLinkClick={this.onViewEmotesLinkClick}
                onUserlistLinkClick={this.onUserlistLinkClick}
            />
        );
    }

}

export default withRouter(TopnavContainer);