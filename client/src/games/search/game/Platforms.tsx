import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Tooltip } from '@material-ui/core';

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
        <div className="platforms mt-2">
            <div className="title">Platforms</div>
            {props.platforms
                .map((x: string, index: number) => {
                    return (
                        <React.Fragment key={x}>
                            <Tooltip disableFocusListener={true} disableTouchListener={true} title={props.platforms_release_dates[index] !== `undefined. NaN, NaN` ? props.platforms_release_dates[index] : `N/A`}>
                                <Button 
                                    className="platform mx-1 py-1 px-2" 
                                    variant="raised" 
                                    onClick={() => { props.handlePlatformClick(index); }}
                                >
                                    {x}
                                </Button>
                            </Tooltip>
                        </React.Fragment>
                    );
                })}
        </div>
    );

};

export default Platforms;