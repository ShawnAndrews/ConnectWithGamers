import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';

interface ITripleSlideProps {
    games: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const TripleSlide: React.SFC<ITripleSlideProps> = (props: ITripleSlideProps) => {

    const gameOne: GameResponse = props.games[0];
    const gameTwo: GameResponse = props.games[1];
    const gameThree: GameResponse = props.games[2];
    let originalPrice: number = undefined;

    if (gameOne.external.steam) {
        originalPrice = + (Number.parseFloat(gameOne.external.steam.price) / ((100 - gameOne.external.steam.discount_percent) / 100)).toFixed(2);
    }

    return (
        <div className="triple-slide row position-relative w-100 h-100 px-3" onMouseDown={props.onMouseDown} onMouseMove={props.onMouseMove} onMouseUp={props.onMouseUp}>
            <div className="row">
                <div className="col-10 pl-0">
                    <div className="img-container position-relative cursor-pointer" onClick={() => props.onRedirect(gameOne.id)} onMouseOver={() => props.onHoverGame(gameOne.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img src={gameOne.screenshots[0].url} />
                        <div className={`overlay ${props.hoveredGameId === gameOne.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameOne.name}</div>
                        {gameOne.external.steam && gameOne.external.steam.discount_percent &&
                            <div className="price-container mt-2">
                                <div className="discount d-inline-block px-1">-{gameOne.external.steam.discount_percent}%</div>
                                <div className="original-price d-inline-block pl-1"><del>${originalPrice} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameOne.external.steam.price} USD</div>
                            </div>}
                    </div>
                </div>
                <div className="covers col-2 p-0">
                    <div className="h-50 position-relative cursor-pointer pb-1" onClick={() => props.onRedirect(gameTwo.id)} onMouseOver={() => props.onHoverGame(gameTwo.id)} onMouseOut={() => props.onHoverOutGame()}>
                        {gameTwo.cover && 
                            <img className="w-100 h-100" src={gameTwo.cover.url} />} 
                        <div className={`overlay ${props.hoveredGameId === gameTwo.id && 'active'}`} />
                        {gameTwo.external.steam && gameTwo.external.steam.discount_percent && 
                            <div className="discount-percent mt-1 px-1">-{gameTwo.external.steam.discount_percent}%</div>}
                    </div>
                    <div className="h-50 position-relative cursor-pointer pt-1" onClick={() => props.onRedirect(gameThree.id)} onMouseOver={() => props.onHoverGame(gameThree.id)} onMouseOut={() => props.onHoverOutGame()}>
                        {gameThree.cover && 
                            <img className="w-100 h-100" src={gameThree.cover.url} />} 
                        <div className={`overlay ${props.hoveredGameId === gameThree.id && 'active'}`} />
                        {gameThree.external.steam && gameThree.external.steam.discount_percent && 
                            <div className="discount-percent mt-1 px-1">-{gameThree.external.steam.discount_percent}%</div>}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default TripleSlide;