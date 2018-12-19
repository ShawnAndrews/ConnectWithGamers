import * as React from 'react';
import { LeftnavOption } from './LeftnavContainer';
import { Paper } from '@material-ui/core';

interface ILeftnavProps {
    optionSelected: boolean[];
    onOptionClick: (val: number) => void;
    leftnavOptions: LeftnavOption[];
}

const Leftnav: React.SFC<ILeftnavProps> = (props: ILeftnavProps) => {
    
    return (
        <Paper className="col-1 px-0 py-2 br-tl-0 br-tr-0 br-br-0">
            <div className="serverlist text-center y-scrollable h-100">
                {props.leftnavOptions && 
                    props.leftnavOptions.map((x: LeftnavOption, optionIndex: number) => {
                        return (
                            <React.Fragment key={x.redirect}>
                                <div className={`server my-3 ${props.optionSelected[optionIndex] ? "active" : ""}`} onClick={() => { props.onOptionClick(optionIndex); }}>
                                    <img className="chatroom-menu-item" src={props.leftnavOptions[optionIndex].imageUrl}/>
                                </div>
                            </React.Fragment>
                        );
                    })}
            </div>
        </Paper>
    );

};

export default Leftnav;