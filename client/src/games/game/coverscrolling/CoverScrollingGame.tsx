import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import { Textfit } from 'react-textfit';
import Crossfade from '../crossfade/CrossfadeContainer';
import PriceContainer from '../../price/PriceContainer';

interface ICoverScrollingGameProps {
    index: number;
    game: GameResponse;
    onHoverGame: () => void;
    onHoverOutGame: () => void;
    hoveredScreenshotIndex: number;
    goToGame: () => void;
    onVideoPreviewEnded: () => void;
    videoPreviewEnded: boolean;
    hovering: boolean;
}

const CoverScrollingGame: React.SFC<ICoverScrollingGameProps> = (props: ICoverScrollingGameProps) => {

    return (
        <div className={`cover-scrolling-game-${props.index} position-relative bg-transparent cursor-pointer h-100`}>
            <div className="screenshot w-100" onClick={props.goToGame} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
                <Crossfade src={[props.game.cover, ...props.game.screenshots]} index={props.hoveredScreenshotIndex} />
            </div>
            <div className={`overlay ${props.hovering ? 'hovering' : ''}`}/>
            <div className="highlighted-table-text">
                <Textfit className="name px-3 pt-2" min={11} max={15}>
                    {props.game.name}
                </Textfit>
                <div className="game-info-container">
                    {props.game.genres.length > 0 &&
                        <div className={`genre`}>
                            {props.game.genres[0].name}
                        </div>}
                    <PriceContainer
                        game={props.game}
                        showTextStatus={true}
                    />
                </div>
            </div>
        </div>
    );

};

export default CoverScrollingGame;
