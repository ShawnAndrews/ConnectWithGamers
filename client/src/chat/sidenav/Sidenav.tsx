import * as React from 'react';

interface ISidenavProps {
    active: boolean;
    option1Selected: boolean;
    option2Selected: boolean;
    onOption1Click: () => void;
    onOption2Click: () => void;
}

const Sidenav: React.SFC<ISidenavProps> = (props: ISidenavProps) => {

    return (
        <div className={`chatroom-menu ${props.option2Selected ? "chatroom-input-height" : ""} ${props.active ? "active" : ""}`}>
            <div className="chatroom-menu-item-container" onClick={props.onOption1Click}>
                <i className={`fas fa-comments fa-2x chatroom-menu-item ${props.option1Selected ? "active" : ""}`}/>
                <div className={`chatroom-menu-item-title ${props.option1Selected ? "active" : ""}`}>Chat</div>
            </div>
            <div className="chatroom-menu-item-divider"/>
            <div className="chatroom-menu-item-container" onClick={props.onOption2Click}>
                <i className={`fas fa-users fa-2x chatroom-menu-item ${props.option2Selected ? "active" : ""}`}/>
                <div className={`chatroom-menu-item-title ${props.option2Selected ? "active" : ""}`}>Users</div>
            </div>
        </div>
    );

};

export default Sidenav;