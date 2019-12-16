import * as React from 'react';
import { GameResponse, PlatformEnum, IdNamePair } from '../../../../client-server-common/common';
import { Textfit } from 'react-textfit';
import Crossfade from '../crossfade/CrossfadeContainer';
import PriceContainer from '../../price/PriceContainer';

interface ICoverSmallGameProps {
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

const CoverSmallGame: React.SFC<ICoverSmallGameProps> = (props: ICoverSmallGameProps) => {

    return (
        <div className={`cover-small-game-${props.index} position-relative bg-transparent cursor-pointer`}>
            <div className="screenshot w-100" onClick={props.goToGame} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
                <img src={props.game.cover} />
            </div>
            <div className={`overlay ${props.hovering ? 'hovering' : ''}`}/>
            <div className="highlighted-table-text py-3 px-4">
                <Textfit className="name" min={11} max={12}>
                    {props.game.name}
                </Textfit>
            </div>
        </div>
    );

};

export default CoverSmallGame;