import * as React from 'react';

interface IReleaseDateProps {
    next_release_date: string;
}

const ReleaseDate: React.SFC<IReleaseDateProps> = (props: IReleaseDateProps) => {

    return (
        <div className="menu-game-releasedate">
            <h2 className="menu-game-releasedate-header">Next release</h2>
            <i>{props.next_release_date ? props.next_release_date : 'No planned releases'}</i>
        </div>
    );

};

export default ReleaseDate;