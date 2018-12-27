import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Tooltip } from '@material-ui/core';
import { IdNamePair } from '../../../../client-server-common/common';

interface IPlatformsProps {
    platforms: IdNamePair[];
    release_dates: number[];
    handlePlatformClick: (index: number) => void;
}

const Platforms: React.SFC<IPlatformsProps> = (props: IPlatformsProps) => {

    if (!props.platforms) {
        return null;
    }
    
    return (
        <div className="platforms mt-2">
            <div className="title my-1">Platforms</div>
            {props.platforms
                .map((x: IdNamePair, index: number) => {
                    return (
                        <React.Fragment key={x.id}>
                            <Tooltip disableFocusListener={true} disableTouchListener={true} title={props.release_dates[index].toString() !== `undefined. NaN, NaN` ? new Date(props.release_dates[index] * 1000).toDateString() : `N/A`}>
                                <Button 
                                    className="platform mx-1 py-1 px-2" 
                                    variant="raised" 
                                    onClick={() => { props.handlePlatformClick(index); }}
                                >
                                    {x.name}
                                </Button>
                            </Tooltip>
                        </React.Fragment>
                    );
                })}
        </div>
    );

};

export default Platforms;