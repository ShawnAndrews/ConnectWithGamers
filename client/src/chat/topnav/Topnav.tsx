import * as React from 'react';

interface ITopnavProps {
    title: string;
    usersPageActive: boolean;
    cogPageActive: boolean;
    onClickUsersIcon: () => void;
    onClickCogIcon: () => void;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {

    return (
        <div className='chatroom-appbar'>
            <div className={`chatroom-appbar-users-icon ${props.usersPageActive ? `active` : ``}`} onClick={props.onClickUsersIcon}>
                <i className="fas fa-users fa-2x"/>
            </div>
            <div className={`chatroom-appbar-cog-icon ${props.cogPageActive ? `active` : ``}`} onClick={props.onClickCogIcon}>
                <i className="fas fa-cog fa-2x"/>
            </div>
            <div className="title">{props.title}</div>
        </div>
    );

};

export default Topnav;