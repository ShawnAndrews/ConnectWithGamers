import * as React from 'react';
import Slider from "react-slick";
import { Carousel } from 'react-bootstrap';

interface ISlideshowProps {
    trailer: string;
    images: string[];
}

const Slideshow: React.SFC<ISlideshowProps> = (props: ISlideshowProps) => {

    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let slideshowTrailer: JSX.Element = undefined;
    let slideshowImages: JSX.Element[] = undefined;

    if (props.images) {
        slideshowImages = props.images.map((x: any, index: number) => {
            return <Carousel.Item key={index}><img height={deviceWidth} width={deviceWidth} src={x} alt={`Game screenshot ${index}`}/></Carousel.Item>;
        });
    }

    if (props.trailer) {
        slideshowTrailer = (
            <Carousel.Item>
                <iframe height="400px" width="100%" frameBorder="0" allowFullScreen={true} src={props.trailer} />
            </Carousel.Item>
        );
    }

    return (
        <Carousel className="menu-game-media-feed" data-ride="false" data-interval="false">
            {slideshowTrailer}
            {slideshowImages}
        </Carousel>
    );

};

export default Slideshow;