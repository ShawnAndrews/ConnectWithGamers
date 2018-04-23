import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

interface IPlatformsProps {
    platforms: string[];
    platforms_release_dates: string[];
    handlePlatformClick: (index: number) => void;
}

const Platforms: React.SFC<IPlatformsProps> = (props: IPlatformsProps) => {

    if (!props.platforms) {
        return null;
    }

    return (
        <div className="menu-game-platforms">
            <h2 className="menu-game-platforms-header">Platforms</h2>
            <ul>
                {props.platforms
                    .map((x: string, index: number) => {
                        return (
                            <li key={x}><div className="menu-game-platforms-name-container"><RaisedButton className="menu-game-platforms-name" label={x} onClick={() => { props.handlePlatformClick(index); }}/></div><i className="menu-game-platforms-releasedate">({props.platforms_release_dates[index] !== `undefined. NaN, NaN` ? props.platforms_release_dates[index] : `N/A`})</i></li>
                        );
                    })}
            </ul>
        </div>
    );

};

export default Platforms;