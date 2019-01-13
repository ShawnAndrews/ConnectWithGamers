import * as React from 'react';
import { Carousel } from 'react-responsive-carousel';
import YouTube from 'react-youtube';
import { IGDBImage } from '../../../../client-server-common/common';

interface ISlideshowProps {
    trailer: string;
    images: IGDBImage[];
}

const Slideshow: React.SFC<ISlideshowProps> = (props: ISlideshowProps) => {

    const screenshots: string[] = props.images.map((x: IGDBImage) => x.url);
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    const youtubeId: string = props.trailer && props.trailer.substring(props.trailer.lastIndexOf("/") + 1, props.trailer.length);
    let slideshowImages: JSX.Element[] = [];
    
    if (props.trailer) {
        slideshowImages.push(
            <YouTube
                className="m-0 w-100 h-100"
                videoId={youtubeId}
            />
        );
    }

    if (screenshots) {
        screenshots.map((x: any, index: number) => {
            slideshowImages.push(<img key={index} height={deviceWidth} width={deviceWidth} src={x} alt={`Game screenshot ${index}`}/>);
        });
    }
    
    return (
        <Carousel className="carousel" autoPlay={true} showStatus={false} showThumbs={screenshots ? true : false}>
            {slideshowImages}
        </Carousel>
    );

};

export default Slideshow;