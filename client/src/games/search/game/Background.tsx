import * as React from 'react';

interface IBackgroundProps {
    screenshots: string[];
}

const Background: React.SFC<IBackgroundProps> = (props: IBackgroundProps) => {

    return (
        <div className="background-screenshot-container">
            {props.screenshots && 
                <img className="screenshot w-100 h-100" src={props.screenshots[0]} />}
            <div className="filter" />
        </div>
    );

};

export default Background;