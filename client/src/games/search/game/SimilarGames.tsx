import * as React from 'react';
import { SimilarGame, getIGDBImage, IGDBImageSizeEnums } from '../../../../client-server-common/common';
import Slider from "react-slick";

interface ISimilarGamesProps {
    similarGames: SimilarGame[];
    goToGame: (id: number) => void;
    onSimilarGamesMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const SimilarGames: React.SFC<ISimilarGamesProps> = (props: ISimilarGamesProps) => {

    if (!props.similarGames) {
        return null;
    }

    function NextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className="next d-inline-block align-top cursor-pointer"
                style={...style}
                onClick={onClick}
            >
                <i className="fas fa-2x fa-chevron-right color-tertiary"/>
            </div>
        );
    }
    
    function PrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className="prev d-inline-block align-top cursor-pointer"
                style={...style}
                onClick={onClick}
            >
                <i className="fas fa-2x fa-chevron-left color-tertiary"/>
            </div>
        );
    }

    const settings = {
        className: "similar-games-carousel variable-width pt-2",
        infinite: true,
        dots: false,
        swipeToSlide: true,
        variableWidth: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };
    
    return (

        <div className="similar-games-carousel-container my-5">
            <div className="similar-games-carousel-header position-relative mb-2">
                <a className="mr-2">Similar Games</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <Slider {...settings}>
                {props.similarGames.filter((similarGame: SimilarGame) => return similarGame.cover_id).map((similarGame: SimilarGame) => (
                        <div key={similarGame.id} className="similar-game px-2">
                            <img 
                                className="cursor-pointer"
                                src={getIGDBImage(similarGame.cover_id, IGDBImageSizeEnums.cover_big)}
                                onClick={() => props.goToGame(similarGame.id)}
                                onMouseDown={props.onSimilarGamesMouseDown}
                                onMouseMove={props.onSimilarGamesMouseMove}
                                onMouseUp={props.onSimilarGamesMouseUp}
                            />
                        </div>
                    ))}
            </Slider>
        </div>
    );

};

export default SimilarGames;
