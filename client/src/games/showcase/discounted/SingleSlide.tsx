import * as React from 'react';
import { GameResponse, getCachedIGDBImage, IGDBImageSizeEnums, getIGDBImage } from '../../../../client-server-common/common';

interface ISingleSlideProps {
    games: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const SingleSlide: React.SFC<ISingleSlideProps> = (props: ISingleSlideProps) => {

    const game: GameResponse = props.games[0];
    let originalPrice: number = undefined;

    if (game.external.steam) {
        originalPrice = + (Number.parseFloat(game.external.steam.price) / ((100 - game.external.steam.discount_percent) / 100)).toFixed(2);
    }

    return (
        <div className="single-slide position-relative" onMouseDown={props.onMouseDown} onMouseMove={props.onMouseMove} onMouseUp={props.onMouseUp}>
            <div className="img-container position-relative" onClick={() => props.onRedirect(game.id)} onMouseOver={() => props.onHoverGame(game.id)} onMouseOut={() => props.onHoverOutGame()}>
                <img src={game.image_cached ? getCachedIGDBImage(game.screenshots[0].image_id, IGDBImageSizeEnums.screenshot_big) : getIGDBImage(game.screenshots[0].image_id, IGDBImageSizeEnums.screenshot_big)} />
                <div className={`overlay ${props.hoveredGameId === game.id && 'active'}`} />
                <div className="name px-2 mb-2">{game.external.steam && game.external.steam.discount_percent && `Save ${game.external.steam.discount_percent}% on ` } {game.name}</div>
                {game.external.steam && game.external.steam.discount_percent &&
                    <div className="price-container mt-2">
                        <div className="discount d-inline-block px-1">-{game.external.steam.discount_percent}%</div>
                        <div className="original-price d-inline-block pl-1"><del>${originalPrice} USD</del></div>
                        <div className="final-price d-inline-block px-1">${game.external.steam.price} USD</div>
                    </div>}
            </div>
        </div>
    );

};

export default SingleSlide;