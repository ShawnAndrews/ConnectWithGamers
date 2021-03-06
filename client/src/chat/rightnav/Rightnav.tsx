import * as React from 'react';
import { AccountInfo } from '../../../client-server-common/common';
import { IndicatorStatus } from './RightnavContainer';
import { Paper, List, ListItem } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IRightnavProps {
    users: AccountInfo[];
    goToRedirect: (URL: string) => void;
    expanded: boolean;
}

const Rightnav: React.SFC<IRightnavProps> = (props: IRightnavProps) => {
    
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

    const getIndicatorStatus = (minutesLastActive: number): IndicatorStatus => {
        const FIVE_MINS: number = 5;
        const HALF_HOUR_IN_MINS: number = 30;
        if (minutesLastActive < FIVE_MINS) {
            return IndicatorStatus.Green;
        } else if (minutesLastActive <= HALF_HOUR_IN_MINS) {
            return IndicatorStatus.Yellow;
        } else {
            return IndicatorStatus.Red;
        }
    };

    return (
        <Paper className={`chatroom-users ${props.expanded ? 'expanded' : ''} d-inline-block align-top y-scrollable h-100 py-2 br-0`}>
            {props.users.length === 0 && 
                <div className="empty-container d-table h-100 w-100">
                    <div className="empty d-table-cell align-middle text-center color-tertiary">
                        <i className="fas fa-users"/>
                        <div className="text">No users online</div>
                    </div>
                </div>}
            {props.users.length !== 0 && 
                <List>
                    {props.users.map((user: AccountInfo, index: number) => {
                        const profileLink: string = `/cache/chatroom/profile/${user.accountid}.${user.profile_file_extension}`;

                        return (
                            <React.Fragment key={user.username}>
                                <ListItem className="user row m-0 p-0" onClick={() => { props.goToRedirect(`/chat/users/${user.username}`); }} button={true}>
                                    <div className="col-md-2 p-0">
                                        <div className={`user-image ${!Boolean(user.profile) && 'default color-primary'}`}>
                                            {Boolean(user.profile)
                                                ? <img src={profileLink}/>
                                                : user.username.slice(0, 2).toUpperCase()}
                                            <div className={`user-indicator ${getIndicatorStatus(user.last_active) === IndicatorStatus.Green ? 'green' : ''} ${getIndicatorStatus(user.last_active) === IndicatorStatus.Yellow ? 'yellow' : ''} ${getIndicatorStatus(user.last_active) === IndicatorStatus.Red ? 'red' : ''}`}/>
                                        </div>
                                    </div>
                                    <div className="user-text col-10 pl-4 pr-0">
                                        <Textfit className="name w-100" max={17} mode="single">{user.username}</Textfit>
                                        <Textfit className="time h-35" max={11} mode="single">{lastActive(user.last_active)}</Textfit>
                                    </div>
                                </ListItem>
                                {index !== props.users.length && <hr className="translucent-hr my-2"/>}
                            </React.Fragment>);
                        })}
                </List>}
        </Paper>
    );

}; 

export default Rightnav;