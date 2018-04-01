import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { ChatroomUser, CHATROOM_EVENTS, CHAT_SERVER_PORT } from '../../client-server-common/common';

class UserList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.onNewUser = this.onNewUser.bind(this);
        this.state = { userList: [] };

        const socket = io(`${window.location.hostname}:${CHAT_SERVER_PORT}`);
        socket.on(CHATROOM_EVENTS.User, this.onNewUser);
        socket.emit(CHATROOM_EVENTS.Usercount);
    }

    private onNewUser(newUser: ChatroomUser): void {
        const newUserlist: ChatroomUser[] = this.state.userList;
        newUserlist.push(newUser);
        this.setState({ userList: newUserlist });
    }

    render() {

        return (
            <div className="userlist">
                <div className="userlist-header">
                    <strong>User list</strong>
                </div>
                <div className="scrollable chatroom-messages fadeIn" >
                    {this.state.userList
                        .map((x: ChatroomUser, index: number) => {
                            return (
                                <Chip 
                                    key={index}
                                    className="userlist-content"
                                >
                                    {x.image
                                        ? <Avatar className="userlist-content-name-chip no-background" src={x.image}/>
                                        : <Avatar className="userlist-content-name-chip">{x.username.slice(0, 2).toUpperCase()}</Avatar>}
                                    <span className="userlist-content-name">{x.username}</span>
                                    <span className="userlist-content-activity">Last active {x.last_active === 0 ? `seconds ago` : `${x.last_active} minutes ago`}</span>
                                    {x.steam_url && 
                                        <Avatar className="invis-background pull-right userlist-content-link-chip">
                                            <a href={x.steam_url} className="userlist-content-link"><i className="fab fa-steam-square fa-2x" /></a>
                                        </Avatar>}
                                    {x.discord_url && 
                                        <Avatar className="invis-background pull-right userlist-content-link-chip">
                                            <a href={x.discord_url} className="userlist-content-link"><i className="fab fa-discord fa-2x" /></a>
                                        </Avatar>}
                                    {x.twitch_url && 
                                        <Avatar className="invis-background pull-right userlist-content-link-chip">
                                            <a href={x.twitch_url} className="userlist-content-link"><i className="fab fa-twitch fa-2x" /></a>
                                        </Avatar>}
                                </Chip>
                            );
                        })}
                </div>
            </div>
        );

    }

}

export default UserList;