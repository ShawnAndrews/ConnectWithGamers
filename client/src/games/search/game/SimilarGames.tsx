import * as React from 'react';
import { GameResponse, PriceInfoResponse, PricingsEnum } from '../../../../client-server-common/common';
import Slider from "react-slick";
import { Button } from '@material-ui/core';
import Spinner from '../../../spinner/main';

interface ISimilarGamesProps {
    isLoading: boolean;
    similarGames: GameResponse[];
    hoveredSimilarGameIndex: number;
    goToGame: (id: number) => void;
    onSimilarGamesMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseOver: (index: number) => void;
    onSimilarGamesMouseLeave: () => void;
    getConvertedPrice: (price: number, skipCurrencyType: boolean) => string;
}

const SimilarGames: React.SFC<ISimilarGamesProps> = (props: ISimilarGamesProps) => {

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
            {props.isLoading
                ?
                <div className="menu-center">
                    <Spinner className="text-center mt-5 pt-5" loadingMsg="Loading similar games..." />
                </div>
                :
                <Slider {...settings}>
                    {props.similarGames.filter((similarGame: GameResponse) => similarGame.cover_thumb).map((similarGame: GameResponse, index: number) => {
                            const pricingExists: boolean = similarGame.pricings && similarGame.pricings.length > 0; 
                            let bestPrice: number = Number.MAX_SAFE_INTEGER;

                            if (pricingExists) {
                                similarGame.pricings.forEach((pricing: PriceInfoResponse) => {
                                    if (bestPrice) {
                                        if (pricing.pricingEnumSysKeyId === PricingsEnum.main_game) {
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
                                <div key={similarGame.steamId} className="similar-game" onMouseEnter={() => props.onSimilarGamesMouseOver(index)} onMouseLeave={props.onSimilarGamesMouseLeave}>
                                    <img 
                                        className={`cursor-pointer ${index === props.hoveredSimilarGameIndex ? 'active' : ''}`}
                                        src={similarGame.cover_thumb}
                                        onClick={() => props.goToGame(similarGame.steamId)}
                                        onMouseDown={props.onSimilarGamesMouseDown}
                                        onMouseMove={props.onSimilarGamesMouseMove}
                                        onMouseUp={props.onSimilarGamesMouseUp}
                                    />
                                    <div className={`overlay ${index === props.hoveredSimilarGameIndex ? 'active' : ''}`} />
                                    <div className={`text-container text-center w-100 ${index === props.hoveredSimilarGameIndex ? 'active' : ''}`}>
                                        <div className="name mb-1">{similarGame.name}</div>
                                        <Button variant="contained" color="primary" onClick={() => props.goToGame(similarGame.steamId)}>
                                            {!pricingExists
                                                ?
                                                `Visit`
                                                :
                                                bestPrice ? props.getConvertedPrice(bestPrice, false) : 'Free'}
                                        </Button>
                                    </div>
                                </div>
                            );

                        })}
                </Slider>}
        </div>
    );

};

export default SimilarGames;
