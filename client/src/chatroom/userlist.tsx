import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as io from 'socket.io-client';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { ChatroomUser } from '../../client-server-common/common';

export interface IUserListProps {
    
}

class UserList extends React.Component<IUserListProps, any> {

    constructor(props: IUserListProps) {
        super(props);
        this.onNewUser = this.onNewUser.bind(this);
        this.state = { userList: [] };

        const socket = io(`${window.location.hostname}:81`);
        socket.on('new-user', this.onNewUser);
        socket.emit('request-userlist', { hi: false });
    }

    private onNewUser(newUser: ChatroomUser): void {
        console.log(`New user: ${JSON.stringify(newUser)}`);
        const newUserlist: ChatroomUser[] = this.state.userList;
        newUserlist.push(newUser);
        this.setState({ userList: newUserlist });
    }

    render() {

        const styles = {
            chip: {
                marginTop: '20px',
                width: '90%',
                margin: '0 5%',
              height: '52px',
            }
          };

        return (
            <div>
                <div className="chip-header">
                    <strong>User list</strong>
                </div>
                <div className="scrollable chatroom-messages fadeIn" >
                    {this.state.userList
                        .map((x: ChatroomUser, index: number) => {
                            return (
                                <Chip 
                                    key={index}
                                    style={styles.chip}
                                    className="chip-container"
                                >
                                    <Avatar size={48} className="avatar-chip">{x.username.slice(0, 2).toUpperCase()}</Avatar>
                                    <span className="avatar-span">{x.username}</span>
                                    {x.steam_url && 
                                        <Avatar size={48} className="invis-background pull-right">
                                            <a href={x.steam_url} className="avatar-link"><i className="fab fa-steam-square fa-2x" /></a>
                                        </Avatar>}
                                    {x.discord_url && 
                                        <Avatar size={48} className="invis-background pull-right">
                                            <a href={x.discord_url} className="avatar-link"><i className="fab fa-discord fa-2x" /></a>
                                        </Avatar>}
                                    {x.twitch_url && 
                                        <Avatar size={48} className="invis-background pull-right">
                                            <a href={x.twitch_url} className="avatar-link"><i className="fab fa-twitch fa-2x" /></a>
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