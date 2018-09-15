import * as React from 'react';
import Slideshow from './Slideshow';

interface IMediaProps {
    video: string;
    screenshots: string[];
    mediaTitle: string;
}

const Media: React.SFC<IMediaProps> = (props: IMediaProps) => {

    if (!props.video && !props.screenshots) {
        return null;
    }

    return (
        <div className="menu-game-media">
            <h2 className="menu-game-media-header">{props.mediaTitle}</h2>
            <Slideshow trailer={props.video} images={props.screenshots}/>
        </div>
    );

};

export default Media;