import * as React from 'react';
import { IGDBImage, getCachedIGDBImage, IGDBImageSizeEnums, getIGDBImage } from '../../../../client-server-common/common';
import YouTube from 'react-youtube';
import Slider from "react-slick";

interface IMediaProps {
    video: string;
    screenshots: IGDBImage[];
    mediaCarouselElement: any;
    imageScreenshotBigCached: boolean;
}

const Media: React.SFC<IMediaProps> = (props: IMediaProps) => {
    if (!props.video && !props.screenshots) {
        return null;
    }
    const youtubeId: string = props.video && props.video.substring(props.video.lastIndexOf("/") + 1, props.video.length);
    let mediaPreviews: string[] = [];
    if (youtubeId) {
        mediaPreviews.push(`https://img.youtube.com/vi/${youtubeId}/default.jpg`);
    }
    props.screenshots.map((x: IGDBImage) => mediaPreviews.push(props.imageScreenshotBigCached ? getCachedIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big) : getIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big)));
    const settings = {
        customPaging: (i: number): any => {
            return (
                <a className="w-100 h-100">
                    <img className="w-100 h-100" src={mediaPreviews[i]} />
                    {youtubeId && i === 0 && 
                        <div className="video-preview-overlay"/>}
                </a>
            );
        },
        dots: true,
        arrows: false,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000
    };
    const screenshots: string[] = props.screenshots.map((x: IGDBImage) => props.imageScreenshotBigCached ? getCachedIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big) : getIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big));
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let slideshowImages: JSX.Element[] = [];
    
    if (props.video) {
        slideshowImages.push(
            <div className="w-100 h-100" onMouseEnter={() => props.mediaCarouselElement.slickPause()}>
                <div className="aspect-ratio">
                    <YouTube
                        className="m-0"
                        videoId={youtubeId}
                    />
                </div>
            </div>
        );
    }

    if (screenshots) {
        screenshots.map((x: any, index: number) => {
            slideshowImages.push(<img key={index} height={deviceWidth} width={deviceWidth} src={x} alt={`Game screenshot ${index}`}/>);
        });
    }
    
    return (
        <Slider className="media-carousel" ref={slider => (props.mediaCarouselElement = slider)} {...settings}>
            {slideshowImages}
        </Slider>
    );

};

export default Media;
