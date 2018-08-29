import * as React from 'react';
import { SidenavOption } from './SidenavContainer';

interface ISidenavProps {
    optionSelected: boolean[];
    onOptionClick: (val: number) => void;
    sidenavOptions: SidenavOption[];
    sideNavRef: React.RefObject<HTMLDivElement>;
}

const Sidenav: React.SFC<ISidenavProps> = (props: ISidenavProps) => {
    
    return (
        <div className={`chatroom-menu scrollable`} ref={props.sideNavRef}>
            {props.sidenavOptions && 
                props.sidenavOptions.map((x: SidenavOption, optionIndex: number) => {
                    return (
                        <div key={x.redirect}>
                            <div className="chatroom-menu-item-container" onClick={() => { props.onOptionClick(optionIndex); }}>
                                {props.optionSelected[optionIndex] && <div className="chatroom-menu-item-bar"/>}
                                <img className={`chatroom-menu-item ${props.optionSelected[optionIndex] ? "active" : ""}`} src={props.sidenavOptions[optionIndex].imageUrl}/>
                            </div>
                        </div>
                    );
                })}
        </div>
    );

};

export default Sidenav;