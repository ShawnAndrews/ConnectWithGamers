import * as React from 'react';
import { GameResponse, steamAppUrl, IGDBGenre } from '../../../../client-server-common/common';
import { Card, Button } from '@material-ui/core';
import { Textfit } from 'react-textfit';
import CrossfadeImage from 'react-crossfade-image';

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
}

const FullsizeGame: React.SFC<IFullsizeGameProps> = (props: IFullsizeGameProps) => {
    const originalPrice: number = + (parseFloat(props.game.price) / ((100 - props.game.discount_percent) / 100)).toFixed(2);

    return (
        <Card className={`game-${props.index} ${props.isFeatureGame ? 'feature' : ''} ${props.isSubFeatureGame ? 'sub-feature' : ''} ${props.isEditorsChoiceGame ? 'overflow-visible' : ''} primary-shadow position-relative bg-transparent cursor-pointer h-100`} onClick={props.goToGame} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
            <div className="screenshot w-100 h-100">
                <CrossfadeImage src={props.game.screenshots ? props.game.screenshots[props.hoveredScreenshotIndex] : 'https://i.imgur.com/WcPkTiF.png'} />
            </div>
            <div className='overlay'/>
            <div className='text-overlay'/>
            {props.isEditorsChoiceGame &&
                <>
                    <div className="filter w-100 h-100" />
                    <img className="editor-banner" src="https://i.imgur.com/fRULvuf.png" />
                    <div className="editor-banner-text">Editor's Choice</div>
                    {props.game.discount_percent && 
                        <>
                            <img className="discount-banner" src="https://i.imgur.com/taEmL2H.png" />
                            <div className="discount-banner-text">{props.game.discount_percent}% off</div>
                        </>}
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
                                {props.game.genres[0].name}
                            </div>}
                    </>
                    :
                    <>
                        <Textfit className='name' min={18} max={30}>
                            {props.game.name}
                        </Textfit>
                        <div className='genres'>
                            {props.game.genres && props.game.genres.map((x: IGDBGenre) => x.name).join(', ')}
                        </div>
                        <Button
                            className="steam-btn" 
                            variant="raised"
                            onClick={props.goToSteamPage}
                        >
                            Buy now for ${props.game.price} USD
                        </Button>
                    </>}
            </div>
            {!props.isEditorsChoiceGame && props.game.price &&
                <div className={`price-container ${!props.game.discount_percent ? 'no-discount': ''} mt-1`}>
                    {props.game.discount_percent && 
                        <>
                            <div className="discount d-inline-block px-1">-{props.game.discount_percent}%</div>
                            <div className="original-price d-inline-block px-1"><del>${originalPrice} USD</del></div>
                        </>}
                    <div className={`final-price d-inline-block ${props.game.discount_percent ? 'px-1' : 'px-3'}`}>{!isNaN(Number(props.game.price)) ? `$${props.game.price} USD` : props.game.price}</div>
                </div>}
        </Card>
    );

};

export default FullsizeGame;