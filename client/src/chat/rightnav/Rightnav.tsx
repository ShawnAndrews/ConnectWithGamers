import * as React from 'react';
import { ChatroomUser } from '../../../client-server-common/common';
import Avatar from '@material-ui/core/Avatar';
import { IndicatorStatus } from './RightnavContainer';

interface IRightnavProps {
    usersNavRef: React.RefObject<HTMLDivElement>;
    users: ChatroomUser[];
    goToRedirect: (URL: string) => void;
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
        <div className={`chatroom-users scrollable`} ref={props.usersNavRef}>
            {props.users.length === 0 && 
                <div className="chatroom-users-empty">
                    <i className="chatroom-users-empty-icon fas fa-users fa-2x"/>
                    No users online
                </div>}
            {props.users.length !== 0 && 
                props.users.map((user: ChatroomUser, index: number) => {
                    return (
                        <div key={user.username}>
                            <div className="chatroom-users-item" onClick={() => { props.goToRedirect(`/chat/users/${user.username}`); }}>
                                {user.image
                                    ? <Avatar className="chatroom-users-item-chip transparent-background" src={user.image}/>
                                    : <Avatar className="chatroom-users-item-chip">{user.username.slice(0, 2).toUpperCase()}</Avatar>}
                                <div className={`chatroom-users-item-indicator ${getIndicatorStatus(user.last_active) === IndicatorStatus.Green ? 'green' : ''} ${getIndicatorStatus(user.last_active) === IndicatorStatus.Yellow ? 'yellow' : ''} ${getIndicatorStatus(user.last_active) === IndicatorStatus.Red ? 'red' : ''}`}/>
                                <div className="chatroom-users-item-username">{user.username}</div>
                                <div className="chatroom-users-item-activetext">{lastActive(user.last_active)}</div>
                            </div>
                            {index !== props.users.length && <hr className="chatroom-users-hr"/>}
                        </div>
                    );
            })}
        </div>
    );

}; 

export default Rightnav;