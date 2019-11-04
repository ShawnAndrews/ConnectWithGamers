import * as React from 'react';
import { GameResponse, PriceInfoResponse, StateEnum, IdNamePair, PlatformEnum } from '../../../../client-server-common/common';
import { Textfit } from 'react-textfit';
import { getGameBestPricingStatus } from '../../../util/main';
import Crossfade from '../crossfade/CrossfadeContainer';

interface ICoverScrollingGameProps {
    index: number;
    game: GameResponse;
    onHoverGame: () => void;
    onHoverOutGame: () => void;
    hoveredScreenshotIndex: number;
    goToGame: () => void;
    onVideoPreviewEnded: () => void;
    videoPreviewEnded: boolean;
    getConvertedPrice: (price: number) => string;
}

const CoverScrollingGame: React.SFC<ICoverScrollingGameProps> = (props: ICoverScrollingGameProps) => {
    const bestPricing: PriceInfoResponse = getGameBestPricingStatus(props.game.pricings);
    const bestPricingBasePrice: number = bestPricing.price && bestPricing.discount_percent && + (bestPricing.price / ((100 - bestPricing.discount_percent) / 100)).toFixed(2);
    const numericalStatus: boolean = !!bestPricing.price;
    const noBestPricingExists: boolean = bestPricing && bestPricing.price === Number.MAX_SAFE_INTEGER;

    return (
        <div className={`cover-scrolling-game-${props.index} position-relative bg-transparent cursor-pointer h-100`}>
            <div className="screenshot w-100" onClick={props.goToGame} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
                <Crossfade src={[props.game.cover, ...props.game.screenshots]} index={props.hoveredScreenshotIndex} />
            </div>
            <div className='overlay'/>
            <div className="highlighted-table-text">
                <Textfit className="name px-3 pt-2" min={11} max={15}>
                    {props.game.name}
                </Textfit>
                <div className="genre-price-container">
                    {props.game.genres &&
                        <div className={`genre`}>
                            {props.game.genres[0].name}
                        </div>}
                    {!noBestPricingExists &&
                        <div className={`price-container`}>
                            {numericalStatus &&
                                <>
                                    {bestPricing.discount_percent && 
                                        <>
                                            <div className="discount d-inline-block px-1">-{bestPricing.discount_percent}%</div>
                                            <div className="base-price d-inline-block px-1"><del>{props.getConvertedPrice(bestPricingBasePrice)}</del></div>
                                        </>}
                                </>}
                            <div className={`text ${numericalStatus && bestPricing.discount_percent ? `with-discount` : ``} d-inline-block`}>{numericalStatus ? props.getConvertedPrice(bestPricing.price) : props.game.state.id === StateEnum["Early Access"] ? `Early Access` : props.game.state.id === StateEnum.Preorder ? `Preorder` : props.game.state.id === StateEnum.Released ? `Free` : `TBA`}</div>
                        </div>}
                </div>
            </div>
        </div>
    );

};

export default CoverScrollingGame;
