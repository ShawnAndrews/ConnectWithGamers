import * as React from 'react';
import { Paper } from '@material-ui/core';

interface ITopnavProps {
    goBack: () => void;
    title: string;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {
    
    return (
        <div className="topnav p-2 mx-auto my-4">
            <div className="text-center">
                {props.title}
            </div>
        </div>
    );

}; 

export default Topnav;