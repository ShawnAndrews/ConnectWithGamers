import * as React from 'react';
import { GameResponse, IGDBImage, GenreEnums, IGDBImageSizeEnums, getIGDBImage, getCachedIGDBImage, PriceInfoResponse } from '../../../../client-server-common/common';
import { Card, Button } from '@material-ui/core';
import { Textfit } from 'react-textfit';
import Crossfade from '../crossfade/CrossfadeContainer';
import { getGameBestPricingStatus } from '../../../util/main';

interface IFullsizeGameProps {
    index: number;
    game: GameResponse;
    isEditorsChoiceGame: boolean;
    isBigGame: boolean;
    onHoverGame: () => void;
    onHoverOutGame: () => void;
    hoveredScreenshotIndex: number;
    goToGame: () => void;
    onVideoPreviewEnded: () => void;
    videoPreviewEnded: boolean;
    getConvertedPrice: (price: number) => string;
}

const FullsizeGame: React.SFC<IFullsizeGameProps> = (props: IFullsizeGameProps) => {
    const bestPricing: PriceInfoResponse = getGameBestPricingStatus(props.game.pricings);
    const bestPricingBasePrice: number = bestPricing.price && bestPricing.discount_percent && + (bestPricing.price / ((100 - bestPricing.discount_percent) / 100)).toFixed(2);
    const numericalStatus: boolean = !!bestPricing.price;
    const noBestPricingExists: boolean = bestPricing && bestPricing.price === Number.MAX_SAFE_INTEGER;

    return (
        <Card className={`game-${props.index} ${props.isBigGame ? 'big-game' : ''} primary-shadow position-relative bg-transparent cursor-pointer h-100`} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
            <div className="screenshot w-100 h-100" onClick={props.goToGame}>
                <Crossfade src={props.game.screenshots.map((x: IGDBImage) => props.game.image_screenshot_big_cached ? getCachedIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big) : getIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big))} index={props.hoveredScreenshotIndex} />
            </div>
            <div className='overlay'/>
            <div className='text-overlay'/>
            {props.isEditorsChoiceGame &&
                <>
                    <div className="filter w-100 h-100" />
                    <img className="editor-banner" src="https://i.imgur.com/B57fSZj.png" />
                    <div className="editor-banner-text color-primary">Editor's Choice</div>
                </>}
            <div className="highlighted-table-text">
                <>
                    <Textfit className={`name ${props.isBigGame ? 'large' : ''}`} min={props.isBigGame ? 20 : 11} max={props.isBigGame ? 23 : 15}>
                        {props.game.name}
                    </Textfit>
                    {props.game.genres &&
                        <div className={`genre ${props.isBigGame ? 'large' : ''}`}>
                            {GenreEnums[props.game.genres[0]]}
                        </div>}
                </>
            </div>
            {!noBestPricingExists &&
                <>
                    {numericalStatus
                        ?
                        <div className={`price-container ${!bestPricing.price ? `no-price` : (!bestPricing.discount_percent ? 'no-discount': '')} ${props.isBigGame ? 'large' : ''} mt-1`}>
                            {bestPricing.discount_percent && 
                                <>
                                    <div className="discount d-inline-block px-1">-{bestPricing.discount_percent}%</div>
                                    <div className="base-price d-inline-block px-1"><del>{props.getConvertedPrice(bestPricingBasePrice)}</del></div>
                                </>}
                            <div className={`text d-inline-block ${props.isBigGame ? 'large' : ''} px-1`}>{props.getConvertedPrice(bestPricing.price)}</div>
                        </div>
                        :
                        <>
                            <img className="banner" src="https://i.imgur.com/tHFxgQt.png" />
                            <div className={`banner-text ${bestPricing.preorder && 'long-text'} color-primary`}>{bestPricing.coming_soon ? `Soon` : (bestPricing.preorder ? `Preorder` : `Free`)}</div>
                        </>}
                </>}
        </Card>
    );

};

export default FullsizeGame;
