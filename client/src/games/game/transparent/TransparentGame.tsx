import * as React from 'react';
import { GameResponse, PriceInfoResponse } from '../../../../client-server-common/common';
import { getGameBestPricingStatus } from '../../../util/main';
import ReactStars from 'react-stars';

interface ITransparentGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const TransparentGame: React.SFC<ITransparentGameProps> = (props: ITransparentGameProps) => {
    const bestPrice: PriceInfoResponse = getGameBestPricingStatus(props.game.pricings);
    const bestPriceOriginal: number = bestPrice.discount_percent && + (bestPrice.price / ((100 - bestPrice.discount_percent) / 100)).toFixed(2);

    console.log(`p: ${bestPrice.price} // d: ${bestPrice.discount_percent}`);
    return (
        <div className="price-item">
            <div onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover} alt="Game cover"/>
                <div className="name mt-2 mx-auto">
                    {props.game.name}
                </div>
                <div className="stars-container mx-auto">
                    <ReactStars
                        count={5}
                        value={props.game.review.id ? (props.game.review.id / 100) * 5 : 0}
                        size={13}
                        edit={false}
                    />
                </div>
                <div className="pricing position-relative mx-auto">
                    {bestPrice.price || bestPrice.discount_percent 
                        ?
                        <>
                            {bestPrice.discount_percent && <div className="original-price d-inline-block">${bestPriceOriginal}</div>}
                            <div className="price d-inline-block">${bestPrice.price}</div>
                            <div className="discount d-inline-block ml-2">{bestPrice.discount_percent && `-${bestPrice.discount_percent}%`}</div>
                        </>
                        : 
                        <div className="free-text">Free</div>}
                </div>
            </div>
        </div>
    );

};

export default TransparentGame;
