import * as React from 'react';
import { Paper } from '@material-ui/core';

interface ITopnavProps {
    goBack: () => void;
    title: string;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {
    
    return (
        <Paper className="topnav color-secondary bg-primary p-2 mx-auto my-4">
            <div className="text-center">
                {props.title}
            </div>
        </Paper>
    );

}; 

export default Topnav;