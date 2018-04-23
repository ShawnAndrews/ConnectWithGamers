import * as React from 'react';

interface ISidenavProps {
    title: string;
    onClickTopnavBtn: () => void;
    bar1Active: boolean;
    bar2Active: boolean;
    bar3Active: boolean;
}

const Sidenav: React.SFC<ISidenavProps> = (props: ISidenavProps) => {

    return (
        <div className="chatroom-appbar">
            <div className="chatroom-appbar-btn-container">
                <div className="chatroom-appbar-btn" onClick={props.onClickTopnavBtn}>
                    <div className={`bar1 ${props.bar1Active ? "active" : "" }`} />
                    <div className={`bar2 ${props.bar2Active ? "active" : "" }`} />
                    <div className={`bar3 ${props.bar3Active ? "active" : "" }`} />
                </div>
            </div>
            <h1>{props.title}</h1>
        </div>
    );

};

export default Sidenav;