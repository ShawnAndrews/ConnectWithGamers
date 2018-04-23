import * as React from 'react';
import { withRouter } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import AppBar from 'material-ui/AppBar';
import { ChatroomUser } from '../../../../client/client-server-common/common';
import TopnavContainer from '../topnav/TopnavContainer';

interface IUserlistProps {
    sidebarActive: boolean;
    userlist: ChatroomUser[];
    goBack: () => void;
}

const Userlist: React.SFC<IUserlistProps> = (props: IUserlistProps) => {

    return (
        <div className={`userlist scrollable fadeIn ${props.sidebarActive ? "active" : ""}`}>
            {props.userlist
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
    );

};

export default Userlist;