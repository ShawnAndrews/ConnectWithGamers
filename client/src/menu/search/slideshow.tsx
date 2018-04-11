const Carousel = require('react-responsive-carousel').Carousel;
import * as React from 'react';

interface ISlideshowProps {
    images: string[];
}

class Slideshow extends React.Component<ISlideshowProps, any> {

    constructor(props: ISlideshowProps) {
        super(props);
    }

    render() {

        const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        const slideshowImages: JSX.Element[] = this.props.images.map((x: any, index: number) => {
            return <img key={index} height={deviceWidth} width={deviceWidth} src={x} alt={`Game screenshot ${index}`}/>;
        });
        
        return (
            <Carousel className="menu-game-screenshots-feed" showArrows={false} showThumbs={false}>
                {slideshowImages}
            </Carousel>
        );
    }

}

export default Slideshow;