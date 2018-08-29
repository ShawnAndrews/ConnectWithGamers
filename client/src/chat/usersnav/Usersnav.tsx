import * as React from 'react';
import { ChatroomUser } from '../../../client-server-common/common';
import Avatar from '@material-ui/core/Avatar';

interface IUsersnavProps {
    usersNavRef: React.RefObject<HTMLDivElement>;
    users: ChatroomUser[];
    goToRedirect: (URL: string) => void;
}

const Usersnav: React.SFC<IUsersnavProps> = (props: IUsersnavProps) => {
    
    const lastActive = (minutesLastActive: number): string => {
        if (minutesLastActive !== -1) {
            return `Active ${minutesLastActive === 0 ? `seconds ago` : `${minutesLastActive}m ago`}`;
        } else {
            return `Offline`;
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

export default Usersnav;