import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { PlatformEnums } from '../../../../client-server-common/common';

interface IPlatformsProps {
    platforms: number[];
    release_dates: number[];
    handlePlatformClick: (index: number) => void;
}

const Platforms: React.SFC<IPlatformsProps> = (props: IPlatformsProps) => {
    
    return (
        <div className="platforms mt-4">
            <span className="title my-2">{`Platforms: `}</span>
            {props.platforms && props.platforms
                .map((x: number, index: number) => {
                    return (
                        <React.Fragment key={x}>
                            <Tooltip disableFocusListener={true} disableTouchListener={true} title={props.release_dates[index] !== 0 ? new Date(props.release_dates[index] * 1000).toDateString() : `TBA`}>
                                <span 
                                    className="platform cursor-pointer d-inline-block py-1"
                                    onClick={() => { props.handlePlatformClick(index); }}
                                >
                                    {PlatformEnums[x]}
                                </span>
                            </Tooltip>
                        </React.Fragment>
                    );
                })
                .reduce((accu: any, elem: any) => {
                    return accu === null ? [elem] : [...accu, <span>{`, `}</span>, elem]
                }, null)}
        </div>
    );

};

export default Platforms;