import * as React from 'react';
import { IGDBImage } from '../../../../client-server-common/common';

interface IBackgroundProps {
    screenshots: IGDBImage[];
}

const Background: React.SFC<IBackgroundProps> = (props: IBackgroundProps) => {

    return (
        <div className="background-screenshot-container">
            {props.screenshots && 
                <img className="screenshot w-100 h-100" src={props.screenshots[0].url} />}
            <div className="filter" />
        </div>
    );

};

export default Background;