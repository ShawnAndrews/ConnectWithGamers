import * as React from 'react';

interface ISidenavProps {
    title: string;
    usersPageActive: boolean;
    onClickUsersIcon: () => void;
}

const Sidenav: React.SFC<ISidenavProps> = (props: ISidenavProps) => {

    return (
        <div className='chatroom-appbar'>
            <div className={`chatroom-appbar-users-icon ${props.usersPageActive ? `active` : ``}`} onClick={props.onClickUsersIcon}>
                <i className="fas fa-users fa-2x"/>
            </div>
            <div className="title">{props.title}</div>
        </div>
    );

};

export default Sidenav;