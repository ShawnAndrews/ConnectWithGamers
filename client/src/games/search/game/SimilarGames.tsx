import * as React from 'react';
import { getIGDBImage, IGDBImageSizeEnums, GameResponse, PriceInfo, PricingsEnum } from '../../../../client-server-common/common';
import Slider from "react-slick";
import { Button } from '@material-ui/core';

interface ISimilarGamesProps {
    similarGames: GameResponse[];
    hoveredSimilarGameIndex: number;
    goToGame: (id: number) => void;
    onSimilarGamesMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseOver: (index: number) => void;
    onSimilarGamesMouseLeave: () => void;
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
                {props.similarGames.filter((similarGame: GameResponse) => similarGame.cover).map((similarGame: GameResponse, index: number) => {
                        const pricingExists: boolean = similarGame.pricings && similarGame.pricings.length > 0; 
                        let bestPrice: number = Number.MAX_SAFE_INTEGER;

                        if (pricingExists) {
                            similarGame.pricings.forEach((pricing: PriceInfo) => {
                                if (bestPrice) {
                                    if (pricing.pricings_enum === PricingsEnum.main_game) {
                                        if (!pricing.price) {
                                            bestPrice = undefined;
                                        } else {
                                            if (pricing.price < bestPrice) {
                                                bestPrice = pricing.price
                                            }
                                        }
                                    }   
                                }
                            });
                        }

                        return (
                            <div key={similarGame.id} className="similar-game" onMouseEnter={() => props.onSimilarGamesMouseOver(index)} onMouseLeave={props.onSimilarGamesMouseLeave}>
                                <img 
                                    className={`cursor-pointer ${index === props.hoveredSimilarGameIndex ? 'active' : ''}`}
                                    src={getIGDBImage(similarGame.cover.image_id, IGDBImageSizeEnums.cover_big)}
                                    onClick={() => props.goToGame(similarGame.id)}
                                    onMouseDown={props.onSimilarGamesMouseDown}
                                    onMouseMove={props.onSimilarGamesMouseMove}
                                    onMouseUp={props.onSimilarGamesMouseUp}
                                />
                                <div className={`overlay ${index === props.hoveredSimilarGameIndex ? 'active' : ''}`} onClick={() => !pricingExists && props.goToGame(similarGame.id)} />
                                <div className={`text-container text-center w-100 ${index === props.hoveredSimilarGameIndex ? 'active' : ''}`}>
                                    <div className="name mb-1">{similarGame.name}</div>
                                    {pricingExists && 
                                        <Button variant="contained" color="primary" onClick={() => props.goToGame(similarGame.id)}>
                                            {bestPrice ? `$${bestPrice} USD` : 'Free'}
                                        </Button>}
                                </div>
                            </div>
                        );

                    })}
            </Slider>
        </div>
    );

};

export default SimilarGames;
