import * as React from 'react';
import { IGDBImage } from '../../../../client-server-common/common';

interface IBackgroundProps {
    gameId: number;
    screenshots: IGDBImage[];
    video_cached: boolean;
}

const Background: React.SFC<IBackgroundProps> = (props: IBackgroundProps) => {

    return (
        <div className="background-container">
            {!props.video_cached
                ?
                <img className="screenshot w-100 h-100" src={props.screenshots[0].url} />
                :
                <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={true} playsInline={true}>
                    <source src={`/cache/video-previews/${props.gameId}.mp4`} type="Video/mp4"/>
                    <span>Your browser does not support the video tag.</span>
                </video>}
            <div className="filter" />
        </div>
    );

};

export default Background;