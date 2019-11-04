import * as React from 'react';
import Slider from "react-slick";

interface IMediaProps {
    video: string;
    screenshots: string[];
    mediaCarouselElement: any;
}

const Media: React.SFC<IMediaProps> = (props: IMediaProps) => {
    if (!props.video && !props.screenshots) {
        return null;
    }

    let mediaPreviews: string[] = [];
    if (props.video) {
        mediaPreviews.push(props.video);
    }
    props.screenshots.map((x: string) => mediaPreviews.push(x));
    const settings = {
        customPaging: (i: number): any => {
            return (
                <a className="w-100 h-100">
                    <img className="w-100 h-100" src={(props.video && i === 0) ? `https://i.imgur.com/sO7eLKq.png` : mediaPreviews[i]} />
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
    const screenshots: string[] = props.screenshots;
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let slideshowImages: JSX.Element[] = [];
    
    if (props.video) {
        slideshowImages.push(
            <div className="w-100 h-100" onMouseEnter={() => props.mediaCarouselElement.slickPause()}>
                <div className="aspect-ratio">
                    <video controls={true} loop={false} playsInline={true} autoPlay={true} muted={true}>
                        <source src={props.video} type="video/mp4"/>
                        <span>Your browser does not support the video tag.</span>
                    </video>
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
        <Slider className="media-carousel mt-2" ref={slider => (props.mediaCarouselElement = slider)} {...settings}>
            {slideshowImages}
        </Slider>
    );

};

export default Media;
