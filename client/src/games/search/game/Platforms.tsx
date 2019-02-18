import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Tooltip } from '@material-ui/core';
import { PlatformEnums } from '../../../../client-server-common/common';

interface IPlatformsProps {
    platforms: number[];
    release_dates: number[];
    handlePlatformClick: (index: number) => void;
}

const Platforms: React.SFC<IPlatformsProps> = (props: IPlatformsProps) => {
    
    return (
        <div className="platforms color-secondary px-2 mt-4">
            <div className="title my-2">Platforms</div>
            {props.platforms && props.platforms
                .map((x: number, index: number) => {
                    return (
                        <React.Fragment key={x}>
                            <Tooltip disableFocusListener={true} disableTouchListener={true} title={props.release_dates[index] !== 0 ? new Date(props.release_dates[index] * 1000).toDateString() : `TBA`}>
                                <Button 
                                    className="platform hover-tertiary-solid m-2 py-1 px-2" 
                                    variant="raised" 
                                    onClick={() => { props.handlePlatformClick(index); }}
                                >
                                    {PlatformEnums[x]}
                                </Button>
                            </Tooltip>
                        </React.Fragment>
                    );
                })}
        </div>
    );

};

export default Platforms;