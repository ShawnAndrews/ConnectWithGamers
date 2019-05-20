import * as React from 'react';
import { getFormattedDate } from '../../../util/main';

interface IReleaseDateProps {
    firstReleaseDate: number;
}

const ReleaseDate: React.SFC<IReleaseDateProps> = (props: IReleaseDateProps) => {
    
    return (
        <div className="release-date color-secondary mt-1">
            <span className="title my-1">{`Release date: `}</span>
            <span className="date">{getFormattedDate(new Date(props.firstReleaseDate * 1000))}</span>
        </div>
    );

};

export default ReleaseDate;