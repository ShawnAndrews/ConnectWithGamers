import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { AccountInfo } from '../../../../client/client-server-common/common';
import { Textfit } from 'react-textfit';

interface IUserlistProps {
    userlist: AccountInfo[];
    onSearch: React.KeyboardEventHandler<HTMLInputElement>;
}

const Userlist: React.SFC<IUserlistProps> = (props: IUserlistProps) => {

    const lastActive = (minutesLastActive: number): string => {
        const ONE_HOUR_IN_MINS: number = 60;
        const ONE_DAY_IN_MINS: number = 1440;
        if (minutesLastActive !== -1) {
            if (minutesLastActive === 0) {
                return `Active seconds ago`;
            } else if (minutesLastActive <= ONE_HOUR_IN_MINS) {
                return `Active ${minutesLastActive} mins ago`;
            } else if (minutesLastActive <= ONE_DAY_IN_MINS) {
                return `Active ${Math.floor(minutesLastActive / ONE_HOUR_IN_MINS)}h ${minutesLastActive % ONE_HOUR_IN_MINS}m ago`;
            } else {
                return `Active ${Math.floor(minutesLastActive / ONE_DAY_IN_MINS)} days ago`;
            }
        } else {
            return `Offline`;
        }
    };

    return (
        <div className="chatroom-userlist py-3 h-100">
            {props.userlist.length === 0 
                ?
                <div className="noresults d-table w-100 h-100">
                    <div className="noresults-container d-table-cell align-middle text-center">
                        <div className="noresults-image"><i className="fas fa-user-slash"/></div>
                        <strong className="noresults-text">No users found</strong>
                    </div>
                </div>
                :
                <div className={`userlist y-scrollable custom-scrollbar h-100 px-4 px-sm-5`}>
                    {props.userlist
                        .map((x: AccountInfo, index: number) => {
                            return (
                                <Paper
                                    key={index}
                                    className="user row my-3 p-3"
                                    elevation={3}
                                >
                                    {x.image
                                        ? <Avatar className="user-image col-2 col-lg-1 p-0" src={x.image}/>
                                        : <Avatar className="user-image default col-2 col-lg-1">{x.username.slice(0, 2).toUpperCase()}</Avatar>}
                                    <div className="user-text col-10 col-md-6 col-lg-8">
                                        <Textfit className="name font-weight-bold h-50">{x.username}</Textfit>
                                        <Textfit className="time h-50" max={12}>{lastActive(x.last_active)}</Textfit>
                                    </div>
                                    <div className="user-links text-right col-0 col-md-4 col-lg-3 pr-0">
                                        {x.steam && 
                                            <a href={`https://steamcommunity.com/id/${x.steam}`} className="link mx-1"><i className="fab fa-steam-square fa-2x" /></a>}
                                        {x.discord && 
                                            <a href={x.discord} className="link mx-2"><i className="fab fa-discord fa-2x" /></a>}
                                        {x.twitch && 
                                            <a href={`https://www.twitch.tv/${x.twitch}`} className="link mx-2"><i className="fab fa-twitch fa-2x" /></a>}
                                    </div>
                                </Paper>
                            );
                        })}
                </div>}
        </div>
    );

};

export default Userlist;