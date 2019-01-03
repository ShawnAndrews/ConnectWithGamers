import * as React from 'react';
import Userlist from "./Userlist";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';
import { AccountInfo, CHATROOM_EVENTS, CHAT_SERVER_PORT } from '../../../../client/client-server-common/common';

enum UserListState {
    Search,
    User,
    All
}

interface SearchState {
    state: UserListState;
    searchText: string;
}

interface IUserlistContainerProps extends RouteComponentProps<any> { }

interface IUserlistContainerState {
    socket: SocketIOClient.Socket;
    userlist: AccountInfo[];
    listState: UserListState;
    searchText: string;
}

class UserlistContainer extends React.Component<IUserlistContainerProps, IUserlistContainerState> {

    constructor(props: IUserlistContainerProps) {
        super(props);
        this.onUsers = this.onUsers.bind(this);
        this.onSearch = this.onSearch.bind(this);
        const searchState: SearchState = this.getSearchState(props);

        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        this.state = { 
            socket: socket, 
            userlist: [],
            listState: searchState.state,
            searchText: searchState.searchText
        };
        
        socket.on(CHATROOM_EVENTS.Users, this.onUsers);
    }

    componentDidMount(): void {
        this.state.socket.emit(CHATROOM_EVENTS.SearchUsers, { filter: this.state.searchText });
    }

    componentWillReceiveProps(newProps: IUserlistContainerProps): void {
        const searchState: SearchState = this.getSearchState(newProps);
        this.state.socket.emit(CHATROOM_EVENTS.SearchUsers, { filter: searchState.searchText });
        this.setState({ listState: searchState.state, searchText: searchState.searchText });
    }

    getSearchState(someProps: IUserlistContainerProps): SearchState {
        const searchState: SearchState = { state: undefined, searchText: undefined };
        const queryString: any = someProps.location.search ? JSON.parse('{"' + decodeURI(someProps.location.search.substring(1).replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}') : {};
        
        if (queryString.search) {
            searchState.state = UserListState.Search;
        } else if (someProps.match.params.user) {
            searchState.state = UserListState.User;
        } else {
            searchState.state = UserListState.All;
        }

        searchState.searchText = someProps.match.params.user || queryString.search || '';

        return searchState;
    }

    onUsers(users: AccountInfo[]): void {
        const newUserlist: AccountInfo[] = users;
        this.setState({ userlist: newUserlist });
    }

    onSearch(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            this.state.socket.emit(CHATROOM_EVENTS.SearchUsers, { filter: event.currentTarget.value });
        }
    }

    render() {
        return (
            <Userlist
                userlist={this.state.userlist}
                onSearch={this.onSearch}
            />
        );
    }

}

export default withRouter(UserlistContainer);