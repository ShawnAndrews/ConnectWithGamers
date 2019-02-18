import * as React from 'react';
import { GameResponse, IGDBGenre, IGDBImage, GenreEnums, IGDBImageSizeEnums, getIGDBImage, getCachedIGDBImage, PriceInfo, IGDBExternalCategoryEnum } from '../../../../client-server-common/common';
import { Card, Button } from '@material-ui/core';
import { Textfit } from 'react-textfit';
import Crossfade from '../crossfade/CrossfadeContainer';

interface IFullsizeGameProps {
    index: number;
    game: GameResponse;
    isEditorsChoiceGame: boolean;
    isFeatureGame: boolean;
    isSubFeatureGame: boolean;
    onHoverGame: () => void;
    onHoverOutGame: () => void;
    hoveredScreenshotIndex: number;
    goToGame: () => void;
    goToSteamPage: () => void;
    onVideoPreviewEnded: () => void;
    videoPreviewEnded: boolean;
}

const FullsizeGame: React.SFC<IFullsizeGameProps> = (props: IFullsizeGameProps) => {
    let steamPriceInfo: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.steam);
    let steamIsFree: boolean = steamPriceInfo && !steamPriceInfo.price;
    let steamIsDiscounted: boolean = steamPriceInfo && steamPriceInfo.price && !!steamPriceInfo.discount_percent;
    let steamBasePrice: number = steamIsDiscounted && + (parseFloat(steamPriceInfo.price) / ((100 - steamPriceInfo.discount_percent) / 100)).toFixed(2);

    let gogPriceInfo: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.gog);
    let goIsFree: boolean = steamPriceInfo && !steamPriceInfo.price;
    let goIsDiscounted: boolean = steamPriceInfo && steamPriceInfo.price && !!steamPriceInfo.discount_percent;
    let goBasePrice: number = steamIsDiscounted && + (parseFloat(steamPriceInfo.price) / ((100 - steamPriceInfo.discount_percent) / 100)).toFixed(2);

    let microsoftPriceInfo: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.microsoft);
    let microsoftIsFree: boolean = steamPriceInfo && !steamPriceInfo.price;
    let microsoftIsDiscounted: boolean = steamPriceInfo && steamPriceInfo.price && !!steamPriceInfo.discount_percent;
    let microsoftBasePrice: number = steamIsDiscounted && + (parseFloat(steamPriceInfo.price) / ((100 - steamPriceInfo.discount_percent) / 100)).toFixed(2);

    let applePriceInfo: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.apple);
    let appleIsFree: boolean = steamPriceInfo && !steamPriceInfo.price;
    let appleIsDiscounted: boolean = steamPriceInfo && steamPriceInfo.price && !!steamPriceInfo.discount_percent;
    let appleBasePrice: number = steamIsDiscounted && + (parseFloat(steamPriceInfo.price) / ((100 - steamPriceInfo.discount_percent) / 100)).toFixed(2);

    let androidPriceInfo: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.android);
    let androidIsFree: boolean = steamPriceInfo && !steamPriceInfo.price;
    let androidIsDiscounted: boolean = steamPriceInfo && steamPriceInfo.price && !!steamPriceInfo.discount_percent;
    let androidBasePrice: number = steamIsDiscounted && + (parseFloat(steamPriceInfo.price) / ((100 - steamPriceInfo.discount_percent) / 100)).toFixed(2);


    return (
        <Card className={`game-${props.index} ${props.isFeatureGame ? 'feature' : ''} ${props.isSubFeatureGame ? 'sub-feature' : ''} ${props.isEditorsChoiceGame ? 'editor-feature overflow-visible' : ''} primary-shadow position-relative bg-transparent cursor-pointer h-100`} onClick={props.goToGame} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
            {!props.isEditorsChoiceGame &&
                <div className="screenshot w-100 h-100">
                    <Crossfade src={props.game.screenshots.map((x: IGDBImage) => props.game.image_cached ? getCachedIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big) : getIGDBImage(x.image_id, IGDBImageSizeEnums.screenshot_big))} index={props.hoveredScreenshotIndex} />
                </div>}
            {props.isEditorsChoiceGame &&
                (!props.videoPreviewEnded
                ?
                <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={props.game.screenshots.length > 0 ? false : true} onEnded={props.onVideoPreviewEnded} playsInline={true}>
                    <source src={`/cache/video-previews/${props.game.id}.mp4`} type="Video/mp4"/>
                    <span>Your browser does not support the video tag.</span>
                </video>
                :
                <>
                    {<img className="screenshot w-100 h-100" src={props.game.image_cached ? getCachedIGDBImage(props.game.screenshots[0].image_id, IGDBImageSizeEnums.screenshot_big) : getIGDBImage(props.game.screenshots[0].image_id, IGDBImageSizeEnums.screenshot_big)} />}
                </>)}
            <div className='overlay'/>
            {!props.isEditorsChoiceGame && <div className='text-overlay'/>}
            {props.isEditorsChoiceGame &&
                <>
                    <div className="filter w-100 h-100" />
                    <img className="editor-banner" src="https://i.imgur.com/B57fSZj.png" />
                    <div className="editor-banner-text color-primary">Editor's Choice</div>
                </>}
            <div className={`highlighted-table-text ${props.isEditorsChoiceGame ? 'editors-choice' : ''}`}>
                {!props.isEditorsChoiceGame
                    ?
                    <>
                        <Textfit className='name' min={11} max={15}>
                            {props.game.name}
                        </Textfit>
                        {props.game.genres &&
                            <div className="genre">
                                {GenreEnums[props.game.genres[0]]}
                            </div>}
                    </>
                    :
                    <>
                        <Textfit className='name' min={18} max={30}>
                            {props.game.name}
                        </Textfit>
                        <div className='genres'>
                            {props.game.genres && props.game.genres.map((x: number) => GenreEnums[x]).join(', ')}
                        </div>
                        <div className='platforms'>
                            {props.game.linkIcons && props.game.linkIcons.map((x: string) => <i className={`fab ${x} mx-2`}/>)}
                        </div>
                        {/* {props.game.external.steam && 
                            <Button
                                className="steam-btn mt-3" 
                                variant="raised"
                                onClick={props.goToSteamPage}
                            >
                                Buy now for ${props.game.external.steam.price} USD
                            </Button>} */}
                    </>}
            </div>
            {/* {!props.isEditorsChoiceGame && isNoPrice &&
                <img className={`status-banner ${isFree ? 'short' : ''}`} src="https://i.imgur.com/QpvQV2Q.png"/>}
            {!props.isEditorsChoiceGame && props.game.external.steam &&
                <div className={`price-container ${isNoPrice ? `no-price` : (!props.game.external.steam.discount_percent ? 'no-discount': '')} mt-1`}>
                    {props.game.external.steam.discount_percent && 
                        <>
                            <div className="discount d-inline-block px-1">-{props.game.external.steam.discount_percent}%</div>
                            <div className="original-price d-inline-block px-1"><del>${originalPrice} USD</del></div>
                        </>}
                    <div className="text d-inline-block px-1">{!isNaN(Number(props.game.external.steam.price)) ? `$${props.game.external.steam.price} USD` : props.game.external.steam.price}</div>
                </div>} */}
        </Card>
    );

};

export default FullsizeGame;
