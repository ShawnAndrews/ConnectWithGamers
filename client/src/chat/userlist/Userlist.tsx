import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { ChatroomUser } from '../../../../client/client-server-common/common';

interface IUserlistProps {
    searched: boolean;
    userlist: ChatroomUser[];
    onSearch: React.KeyboardEventHandler<HTMLInputElement>;
}

const Userlist: React.SFC<IUserlistProps> = (props: IUserlistProps) => {

    const lastActive = (minutesLastActive: number): string => {
        if (minutesLastActive !== -1) {
            return `Last active ${minutesLastActive === 0 ? `seconds ago` : `${minutesLastActive} minutes ago`}`;
        } else {
            return `Offline`;
        }
    };

    return (
        <div className="userlist-container">
            <div className="userlist-searchbar-container">
                <input
                    className="userlist-searchbar"
                    placeholder="Search user..."
                    onKeyPress={props.onSearch}
                />
            </div>
            {!props.searched &&
                <div className="choose-user">
                    <i className="fas fa-arrow-right fa-6x choose-user-arrow" data-fa-transform="rotate-270"/>
                    <strong className="choose-user-text">Search username</strong>
                </div>}
            {props.searched && props.userlist.length === 0 && 
                <div className="search-noresults">
                    <strong className="search-noresults-text">No results</strong>
                </div>}
            {props.searched && props.userlist.length !== 0 && 
                <div className={`userlist scrollable fadeIn`}>
                    {props.userlist
                        .map((x: ChatroomUser, index: number) => {
                            return (
                                <Paper
                                    key={index}
                                    className="userlist-content"
                                    elevation={3}
                                >
                                    {x.image
                                        ? <Avatar className="userlist-content-name-chip no-background" src={x.image}/>
                                        : <Avatar className="userlist-content-name-chip">{x.username.slice(0, 2).toUpperCase()}</Avatar>}
                                    <span className="userlist-content-name">{x.username}</span>
                                    <span className="userlist-content-activity">{lastActive(x.last_active)}</span>
                                    <div className="userlist-content-links">
                                        {x.steam_url && 
                                            <a href={`https://steamcommunity.com/id/${x.steam_url}`} className="userlist-content-link"><i className="fab fa-steam-square fa-2x" /></a>}
                                        {x.discord_url && 
                                            <a href={x.discord_url} className="userlist-content-link"><i className="fab fa-discord fa-2x" /></a>}
                                        {x.twitch_url && 
                                            <a href={`https://www.twitch.tv/${x.twitch_url}`} className="userlist-content-link"><i className="fab fa-twitch fa-2x" /></a>}
                                    </div>
                                </Paper>
                            );
                        })}
                </div>}
        </div>
    );

};

export default Userlist;