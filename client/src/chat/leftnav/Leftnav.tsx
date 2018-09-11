import * as React from 'react';
import { LeftnavOption } from './LeftnavContainer';

interface ILeftnavProps {
    optionSelected: boolean[];
    onOptionClick: (val: number) => void;
    leftnavOptions: LeftnavOption[];
    sideNavRef: React.RefObject<HTMLDivElement>;
}

const Leftnav: React.SFC<ILeftnavProps> = (props: ILeftnavProps) => {
    
    return (
        <div className={`chatroom-menu scrollable`} ref={props.sideNavRef}>
            {props.leftnavOptions && 
                props.leftnavOptions.map((x: LeftnavOption, optionIndex: number) => {
                    return (
                        <div key={x.redirect}>
                            <div className="chatroom-menu-item-container" onClick={() => { props.onOptionClick(optionIndex); }}>
                                {props.optionSelected[optionIndex] && <div className="chatroom-menu-item-bar"/>}
                                <img className={`chatroom-menu-item ${props.optionSelected[optionIndex] ? "active" : ""}`} src={props.leftnavOptions[optionIndex].imageUrl}/>
                            </div>
                        </div>
                    );
                })}
        </div>
    );

};

export default Leftnav;