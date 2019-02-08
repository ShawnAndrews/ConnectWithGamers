import * as React from 'react';
import { IGDBImage, getCachedIGDBImage, IGDBImageSizeEnums, getIGDBImage } from '../../../../client-server-common/common';

interface IBackgroundProps {
    gameId: number;
    screenshots: IGDBImage[];
    videoCached: boolean;
    imageCached: boolean;
}

const Background: React.SFC<IBackgroundProps> = (props: IBackgroundProps) => {

    return (
        <div className="background-container">
            {!props.videoCached
                ?
                <img className="screenshot w-100 h-100" src={props.imageCached ? getCachedIGDBImage(props.screenshots[0].image_id, IGDBImageSizeEnums.screenshot_big) : getIGDBImage(props.screenshots[0].image_id, IGDBImageSizeEnums.screenshot_big)} />
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