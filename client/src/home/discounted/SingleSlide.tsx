import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';

interface ISingleSlideProps {
    games: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
}

const SingleSlide: React.SFC<ISingleSlideProps> = (props: ISingleSlideProps) => {

    const game: GameResponse = props.games[0];
    const originalPrice: number = + (parseFloat(game.price) / ((100 - game.discount_percent) / 100)).toFixed(2);

    return (
        <div className="single-slide position-relative">
            <div className="img-container position-relative" onClick={() => props.onRedirect(game.id)} onMouseOver={() => props.onHoverGame(game.id)} onMouseOut={() => props.onHoverOutGame()}>
                <img src={game.screenshots[0].url} />
                <div className={`overlay ${props.hoveredGameId === game.id && 'active'}`} />
                <div className="name px-2 mb-2">{game.discount_percent && `Save ${game.discount_percent}% on ` } {game.name}</div>
                {game.discount_percent &&
                    <div className="price-container mt-2">
                        <div className="discount d-inline-block px-1">-{game.discount_percent}%</div>
                        <div className="original-price d-inline-block pl-1"><del>${originalPrice} USD</del></div>
                        <div className="final-price d-inline-block px-1">${game.price} USD</div>
                    </div>}
            </div>
        </div>
    );

};

export default SingleSlide;