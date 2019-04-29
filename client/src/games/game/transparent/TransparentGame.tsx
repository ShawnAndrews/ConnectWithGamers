import * as React from 'react';
import { GameResponse, getCachedIGDBImage, IGDBImageSizeEnums, getIGDBImage, PriceInfoResponse } from '../../../../client-server-common/common';
import { getGameBestPricingStatus } from '../../../util/main';
import ReactStars from 'react-stars';

interface ITransparentGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const TransparentGame: React.SFC<ITransparentGameProps> = (props: ITransparentGameProps) => {
    const bestPrice: PriceInfoResponse = getGameBestPricingStatus(props.game.pricings);
    const bestPriceOriginal: number = bestPrice.discount_percent && + (bestPrice.price / ((100 - bestPrice.discount_percent) / 100)).toFixed(2);

    const pricingContainerWidth: number = (120 / props.game.cover.height) * props.game.cover.width;

    const gameContainer = {
        width: pricingContainerWidth
    };

    return (
        <div className="horizontal-item">
            <div onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover ? (props.game.image_cover_big_cached ? getCachedIGDBImage(props.game.cover.image_id, IGDBImageSizeEnums.cover_big) : getIGDBImage(props.game.cover.image_id, IGDBImageSizeEnums.cover_big)) : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <div className="name mt-2 mx-auto">
                    {props.game.name}
                </div>
                <div className="mx-auto" style={gameContainer}>
                    <ReactStars
                        count={5}
                        value={props.game.aggregated_rating ? (props.game.aggregated_rating / 100) * 5 : 0}
                        size={13}
                        edit={false}
                    />
                </div>
                <div className="pricing position-relative mx-auto" style={gameContainer}>
                    <div className="original-price d-inline-block">${bestPriceOriginal}</div>
                    <div className="price d-inline-block">${bestPrice.price}</div>
                    <div className="discount d-inline-block ml-2">-{bestPrice.discount_percent}%</div>
                </div>
            </div>
        </div>
    );

};

export default TransparentGame;
