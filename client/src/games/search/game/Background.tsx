import * as React from 'react';

interface IBackgroundProps {
    gameId: number;
    screenshots: string[];
    video: string;
}

const Background: React.SFC<IBackgroundProps> = (props: IBackgroundProps) => {

    return (
        <div className="background-container">
            {!props.video
                ?
                <img className="screenshot w-100 h-100" src={props.screenshots[0]} />
                :
                <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={true} playsInline={true}>
                    <source src={props.video} type="video/mp4"/>
                    <span>Your browser does not support the video tag.</span>
                </video>}
            <div className="filter" />
        </div>
    );

};

export default Background;