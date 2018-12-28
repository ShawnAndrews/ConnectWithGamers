import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';

interface IQuadrupleSlideProps {
    games: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
}

const QuadrupleSlide: React.SFC<IQuadrupleSlideProps> = (props: IQuadrupleSlideProps) => {

    const gameOne: GameResponse = props.games[0];
    const gameTwo: GameResponse = props.games[1];
    const gameThree: GameResponse = props.games[2];
    const gameFour: GameResponse = props.games[3];
    const originalPriceOne: number = + (parseFloat(gameOne.price) / ((100 - gameOne.discount_percent) / 100)).toFixed(2);
    const originalPriceTwo: number = + (parseFloat(gameTwo.price) / ((100 - gameTwo.discount_percent) / 100)).toFixed(2);
    const originalPriceThree: number = + (parseFloat(gameThree.price) / ((100 - gameThree.discount_percent) / 100)).toFixed(2);
    const originalPriceQuadruple: number = + (parseFloat(gameFour.price) / ((100 - gameFour.discount_percent) / 100)).toFixed(2);

    return (
        <div className="quadruple-slide position-relative w-100">
            <div className="row h-50 w-100 p-0">
                <div className="col-6 p-0">
                    <div className="img-container h-100 mb-1 mr-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameOne.id)} onMouseOver={() => props.onHoverGame(gameOne.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameOne.screenshots[0]} />
                        <div className={`overlay ${props.hoveredGameId === gameOne.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameOne.name}</div>
                        {gameOne.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block h-100 px-1">-{gameOne.discount_percent}%</div>
                                <div className="original-price d-inline-block h-50 px-1"><del>${originalPriceOne} USD</del></div>
                                <div className="final-price d-inline-block h-50 px-1">${gameOne.price} USD</div>
                            </div>}
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="img-container h-100 ml-1 mb-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameTwo.id)} onMouseOver={() => props.onHoverGame(gameTwo.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameTwo.screenshots[0]} />
                        <div className={`overlay ${props.hoveredGameId === gameTwo.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameTwo.name}</div>
                        {gameTwo.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block px-1">-{gameTwo.discount_percent}%</div>
                                <div className="original-price d-inline-block px-1"><del>${originalPriceTwo} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameTwo.price} USD</div>
                            </div>}
                    </div>
                </div>
            </div>
            <div className="row h-50 w-100 p-0">
                <div className="col-6 p-0">
                    <div className="img-container h-100 mr-1 mt-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameThree.id)} onMouseOver={() => props.onHoverGame(gameThree.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameThree.screenshots[0]} />
                        <div className={`overlay ${props.hoveredGameId === gameThree.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameThree.name}</div>
                        {gameThree.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block px-1">-{gameThree.discount_percent}%</div>
                                <div className="original-price d-inline-block px-1"><del>${originalPriceThree} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameThree.price} USD</div>
                            </div>}
                    </div>
                </div>
                <div className="col-6 p-0">
                    <div className="img-container h-100 ml-1 mt-1 position-relative cursor-pointer" onClick={() => props.onRedirect(gameFour.id)} onMouseOver={() => props.onHoverGame(gameFour.id)} onMouseOut={() => props.onHoverOutGame()}>
                        <img className="w-100" src={gameFour.screenshots[0]} />
                        <div className={`overlay ${props.hoveredGameId === gameFour.id && 'active'}`} />
                        <div className="name px-2 mb-2">{gameFour.name}</div>
                        {gameFour.discount_percent &&
                            <div className="price-container mt-1 mr-1">
                                <div className="discount d-inline-block px-1">-{gameFour.discount_percent}%</div>
                                <div className="original-price d-inline-block px-1"><del>${originalPriceQuadruple} USD</del></div>
                                <div className="final-price d-inline-block px-1">${gameFour.price} USD</div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default QuadrupleSlide;