import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import SingleSlide from './SingleSlide';
import TripleSlide from './TripleSlide';
import QuadrupleSlide from './QuadrupleSlide';
import Slider from "react-slick";

interface IDiscountGameListProps {
    discountedGames: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const DiscountedGameList: React.SFC<IDiscountGameListProps> = (props: IDiscountGameListProps) => {

    const settings = {
        autoplay: true,
        autoplaySpeed: 6000,
        slidesToShow: 3,
        dots: true,
        centerPadding: '60px',
        arrows: false,
        infinite: true,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    infinite: true,
                    slidesToShow: 1,
                    arrows: false,
                    centerPadding: '40px',
                }
            }
        ]
    };

    return (
        <div className="discount-carousel-container">
            <div className="discount-carousel-header position-relative mb-2">
                <a className="mr-2">Discounted</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <Slider {...settings} className="discount-carousel col-12 p-0 my-3 mb-5" >
                {props.discountedGames.length > 12 &&
                    <SingleSlide
                        games={props.discountedGames.slice(0, 1)}
                        onRedirect={props.onRedirect}
                        onHoverGame={props.onHoverGame}
                        onHoverOutGame={props.onHoverOutGame}
                        hoveredGameId={props.hoveredGameId}
                        onMouseDown={props.onMouseDown}
                        onMouseMove={props.onMouseMove}
                        onMouseUp={props.onMouseUp}
                    />}
                {props.discountedGames.length > 12 &&
                    <QuadrupleSlide
                        games={props.discountedGames.slice(1, 5)}
                        onRedirect={props.onRedirect}
                        onHoverGame={props.onHoverGame}
                        onHoverOutGame={props.onHoverOutGame}
                        hoveredGameId={props.hoveredGameId}
                        onMouseDown={props.onMouseDown}
                        onMouseMove={props.onMouseMove}
                        onMouseUp={props.onMouseUp}
                    />}
                {props.discountedGames.length > 12 &&
                    <TripleSlide
                        games={props.discountedGames.slice(5, 8)}
                        onRedirect={props.onRedirect}
                        onHoverGame={props.onHoverGame}
                        onHoverOutGame={props.onHoverOutGame}
                        hoveredGameId={props.hoveredGameId}
                        onMouseDown={props.onMouseDown}
                        onMouseMove={props.onMouseMove}
                        onMouseUp={props.onMouseUp}
                    />}
                {props.discountedGames.length > 12 &&
                    <QuadrupleSlide
                        games={props.discountedGames.slice(8, 12)}
                        onRedirect={props.onRedirect}
                        onHoverGame={props.onHoverGame}
                        onHoverOutGame={props.onHoverOutGame}
                        hoveredGameId={props.hoveredGameId}
                        onMouseDown={props.onMouseDown}
                        onMouseMove={props.onMouseMove}
                        onMouseUp={props.onMouseUp}
                    />}
                {props.discountedGames && 
                    props.discountedGames.slice(props.discountedGames.length > 12 ? 12 : 0).map((game: GameResponse) => (
                        <SingleSlide
                            games={[game]}
                            onRedirect={props.onRedirect}
                            onHoverGame={props.onHoverGame}
                            onHoverOutGame={props.onHoverOutGame}
                            hoveredGameId={props.hoveredGameId}
                            onMouseDown={props.onMouseDown}
                            onMouseMove={props.onMouseMove}
                            onMouseUp={props.onMouseUp}
                        />
                    ))}
            </Slider>
        </div>
    );   

};

export default DiscountedGameList;