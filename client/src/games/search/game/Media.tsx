import * as React from 'react';
import Slideshow from './Slideshow';

interface IMediaProps {
    video: string;
    screenshots: string[];
}

const Media: React.SFC<IMediaProps> = (props: IMediaProps) => {

    if (!props.video && !props.screenshots) {
        return null;
    }
    
    return (
        <div className="col-lg-8">
            <Slideshow trailer={props.video} images={props.screenshots}/>
        </div>
    );

};

export default Media;