import * as React from 'react';
import Slideshow from './Slideshow';
import { IGDBImage } from '../../../../client-server-common/common';

interface IMediaProps {
    video: string;
    screenshots: IGDBImage[];
}

const Media: React.SFC<IMediaProps> = (props: IMediaProps) => {

    if (!props.video && !props.screenshots) {
        return null;
    }
    
    return (
        <div className="media mt-4 mt-xl-0">
            <Slideshow trailer={props.video} images={props.screenshots}/>
        </div>
    );

};

export default Media;