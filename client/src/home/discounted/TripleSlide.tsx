import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';

interface ITripleSlideProps {
    games: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
}

const TripleSlide: React.SFC<ITripleSlideProps> = (props: ITripleSlideProps) => {

    const gameOne: GameResponse = props.games[0];
    const gameTwo: GameResponse = props.games[1];
    const gameThree: GameResponse = props.games[2];
    const originalPrice: number = + (parseFloat(gameOne.price) / ((100 - gameOne.discount_percent) / 100)).toFixed(2);

    return (
        <div className="triple-slide row position-relative w-100 h-100 px-3">
            <div className="row">
                <div className="col-10 pl-0">
                    <div className="img-container position-relative cursor-pointer" onClick={() => props.onRedirect(gameOne.id)} onMouseOver={() => props.onHoverGame(gameOne.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img src={gameOne.screenshots[0]} />
                        <div className={`overlay ${props.hoveredGameId === gameOne.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameOne.name}</div>
                        {gameOne.discount_percent &&
                            <div className="price-container mt-2">
                                <div className="discount d-inline-block px-1">-{gameOne.discount_percent}%</div>
                                <div className="original-price d-inline-block pl-1"><del>${originalPrice} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameOne.price} USD</div>
                            </div>}
                    </div>
                </div>
                <div className="covers col-2 p-0">
                    <div className="h-50 position-relative cursor-pointer" onClick={() => props.onRedirect(gameTwo.id)} onMouseOver={() => props.onHoverGame(gameTwo.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100 h-100" src={gameTwo.cover.url} />
                        <div className={`overlay ${props.hoveredGameId === gameTwo.id && 'active'}`} />
                        <div className="discount-percent mt-1 px-1">-{gameTwo.discount_percent}%</div>
                    </div>
                    <div className="h-50 position-relative cursor-pointer" onClick={() => props.onRedirect(gameThree.id)} onMouseOver={() => props.onHoverGame(gameThree.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100 h-100" src={gameThree.cover.url} />
                        <div className={`overlay ${props.hoveredGameId === gameThree.id && 'active'}`} />
                        <div className="discount-percent mt-1 px-1">-{gameThree.discount_percent}%</div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default TripleSlide;