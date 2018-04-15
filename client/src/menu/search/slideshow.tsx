const Carousel = require('react-responsive-carousel').Carousel;
import * as React from 'react';

interface ISlideshowProps {
    images: string[];
}

const Slideshow: React.SFC<ISlideshowProps> = (props: ISlideshowProps) => {

    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    const slideshowImages: JSX.Element[] = props.images.map((x: any, index: number) => {
        return <img key={index} height={deviceWidth} width={deviceWidth} src={x} alt={`Game screenshot ${index}`}/>;
    });
    
    return (
        <Carousel className="menu-game-screenshots-feed" showArrows={false} showThumbs={false}>
            {slideshowImages}
        </Carousel>
    );

};

export default Slideshow;