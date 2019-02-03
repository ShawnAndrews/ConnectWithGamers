import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';

interface IQuadrupleSlideProps {
    games: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const QuadrupleSlide: React.SFC<IQuadrupleSlideProps> = (props: IQuadrupleSlideProps) => {

    const gameOne: GameResponse = props.games[0];
    const gameTwo: GameResponse = props.games[1];
    const gameThree: GameResponse = props.games[2];
    const gameFour: GameResponse = props.games[3];
    let originalPriceOne: number = undefined;
    let originalPriceTwo: number = undefined;
    let originalPriceThree: number = undefined;
    let originalPriceQuadruple: number = undefined;

    if (gameOne.external.steam) {
        originalPriceOne = + (Number.parseFloat(gameOne.external.steam.price) / ((100 - gameOne.external.steam.discount_percent) / 100)).toFixed(2);
        originalPriceTwo = + (Number.parseFloat(gameTwo.external.steam.price) / ((100 - gameTwo.external.steam.discount_percent) / 100)).toFixed(2);
        originalPriceThree = + (Number.parseFloat(gameThree.external.steam.price) / ((100 - gameThree.external.steam.discount_percent) / 100)).toFixed(2);
        originalPriceQuadruple = + (Number.parseFloat(gameFour.external.steam.price) / ((100 - gameFour.external.steam.discount_percent) / 100)).toFixed(2);
    }

    return (
        <div className="quadruple-slide position-relative w-100" onMouseDown={props.onMouseDown} onMouseMove={props.onMouseMove} onMouseUp={props.onMouseUp}>
            <div className="row h-50 w-100 p-0">
                <div className="col-6 p-0">
                    <div className="img-container h-100 mb-1 mr-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameOne.id)} onMouseOver={() => props.onHoverGame(gameOne.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameOne.screenshots[0].url} />
                        <div className={`overlay ${props.hoveredGameId === gameOne.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameOne.name}</div>
                        {gameOne.external.steam.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block h-100 px-1">-{gameOne.external.steam.discount_percent}%</div>
                                <div className="original-price d-inline-block h-50 px-1"><del>${originalPriceOne} USD</del></div>
                                <div className="final-price d-inline-block h-50 px-1">${gameOne.external.steam.price} USD</div>
                            </div>}
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="img-container h-100 ml-1 mb-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameTwo.id)} onMouseOver={() => props.onHoverGame(gameTwo.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameTwo.screenshots[0].url} />
                        <div className={`overlay ${props.hoveredGameId === gameTwo.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameTwo.name}</div>
                        {gameTwo.external.steam && gameTwo.external.steam.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block px-1">-{gameTwo.external.steam.discount_percent}%</div>
                                <div className="original-price d-inline-block px-1"><del>${originalPriceTwo} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameTwo.external.steam.price} USD</div>
                            </div>}
                    </div>
                </div>
            </div>
            <div className="row h-50 w-100 p-0">
                <div className="col-6 p-0">
                    <div className="img-container h-100 mr-1 mt-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameThree.id)} onMouseOver={() => props.onHoverGame(gameThree.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameThree.screenshots[0].url} />
                        <div className={`overlay ${props.hoveredGameId === gameThree.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameThree.name}</div>
                        {gameTwo.external.steam && gameThree.external.steam.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block px-1">-{gameThree.external.steam.discount_percent}%</div>
                                <div className="original-price d-inline-block px-1"><del>${originalPriceThree} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameThree.external.steam.price} USD</div>
                            </div>}
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="img-container h-100 ml-1 mt-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameFour.id)} onMouseOver={() => props.onHoverGame(gameFour.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameFour.screenshots[0].url} />
                        <div className={`overlay ${props.hoveredGameId === gameFour.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameFour.name}</div>
                        {gameTwo.external.steam && gameFour.external.steam.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block px-1">-{gameFour.external.steam.discount_percent}%</div>
                                <div className="original-price d-inline-block px-1"><del>${originalPriceQuadruple} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameFour.external.steam.price} USD</div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default QuadrupleSlide;