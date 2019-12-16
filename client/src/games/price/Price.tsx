import * as React from 'react';
import { StateEnum, PricingStatus, GameResponse } from '../../../client-server-common/common';
import { getLatestMainGamePricingStatus, getBasePrice } from '../../util/main';

interface IPriceGameProps {
    game: GameResponse;
    getConvertedPrice: (price: number) => string;
    showTextStatus: boolean;
}

const PriceGame: React.SFC<IPriceGameProps> = (props: IPriceGameProps) => {
    const bestPricing: PricingStatus = getLatestMainGamePricingStatus(props.game.pricings);
    const bestPricingBasePrice: number = bestPricing.price && bestPricing.discount_percent && getBasePrice(bestPricing.price, bestPricing.discount_percent);
    const isDiscounted: boolean = bestPricing.discount_percent && (new Date(bestPricing.discount_end_dt) > new Date());

    return (
        <div className={`price-container`}>
            {bestPricing.price
                ?
                <>
                    {isDiscounted && 
                        <> 
                            <div className="discount d-inline-block px-1">-{bestPricing.discount_percent}%</div>
                            <div className="base-price d-inline-block px-1"><del>{props.getConvertedPrice(bestPricingBasePrice)}</del></div>
                        </>}
                    <div className={`text ${isDiscounted ? `with-discount` : ``} d-inline-block`}>{props.getConvertedPrice(bestPricing.price)}</div>
                </>
                :
                <div className="text d-inline-block">{props.showTextStatus && props.game.state.id === StateEnum.Preorder ? `Preorder` : props.game.state.id === StateEnum.Released ? `Free` : ``}</div>}
        </div>
    );

};

export default PriceGame;
