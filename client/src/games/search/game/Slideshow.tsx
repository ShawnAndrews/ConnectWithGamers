import * as React from 'react';
import { Carousel } from 'react-responsive-carousel';

interface ISlideshowProps {
    trailer: string;
    images: string[];
}

const Slideshow: React.SFC<ISlideshowProps> = (props: ISlideshowProps) => {

    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let slideshowImages: JSX.Element[] = undefined;

    if (props.images) {
        slideshowImages = props.images.map((x: any, index: number) => {
            return <img key={index} height={deviceWidth} width={deviceWidth} src={x} alt={`Game screenshot ${index}`}/>;
        });
    }

    if (!props.trailer) {
        return (
            <Carousel className="carousel" autoPlay={true} showStatus={false}>
                {slideshowImages}
            </Carousel>
        );
    }

    return (
        <Carousel className="carousel" autoPlay={true} showStatus={false}>
            {props.trailer && <iframe className="m-0 w-100 h-100" frameBorder="0" allowFullScreen={true} src={props.trailer} />}
            {slideshowImages}
        </Carousel>
    );

};

export default Slideshow;