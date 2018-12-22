import * as React from 'react';
import { Carousel } from 'react-responsive-carousel';
import YouTube from 'react-youtube';

interface ISlideshowProps {
    trailer: string;
    images: string[];
}

const Slideshow: React.SFC<ISlideshowProps> = (props: ISlideshowProps) => {

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
    if (props.images) {
        props.images.map((x: any, index: number) => {
            slideshowImages.push(<img key={index} height={deviceWidth} width={deviceWidth} src={x} alt={`Game screenshot ${index}`}/>);
        });
    }
    
    return (
        <Carousel className="carousel" autoPlay={true} showStatus={false}>
            {slideshowImages}
        </Carousel>
    );

};

export default Slideshow;