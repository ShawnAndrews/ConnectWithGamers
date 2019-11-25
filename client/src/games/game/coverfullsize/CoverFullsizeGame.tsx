import * as React from 'react';
import { GameResponse, PlatformEnum, IdNamePair } from '../../../../client-server-common/common';
import { Textfit } from 'react-textfit';
import Crossfade from '../crossfade/CrossfadeContainer';
import PriceContainer from '../../price/PriceContainer';

interface ICoverFullsizeGameProps {
    index: number;
    game: GameResponse;
    onHoverGame: () => void;
    onHoverOutGame: () => void;
    hoveredScreenshotIndex: number;
    goToGame: () => void;
    onVideoPreviewEnded: () => void;
    videoPreviewEnded: boolean;
}

const CoverFullsizeGame: React.SFC<ICoverFullsizeGameProps> = (props: ICoverFullsizeGameProps) => {

    return (
        <div className={`cover-game-${props.index} position-relative bg-transparent cursor-pointer`}>
            <div className="screenshot w-100" onClick={props.goToGame} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
                <Crossfade src={[props.game.cover, ...props.game.screenshots]} index={props.hoveredScreenshotIndex} />
            </div>
            <div className='overlay'/>
            <div className="highlighted-table-text p-3">
                <>
                    <Textfit className="name" min={11} max={15}>
                        {props.game.name}
                    </Textfit>
                    <div className="game-info-container">
                        {props.game.genres &&
                            <div className={`genre`}>
                                {props.game.genres[0].name}
                            </div>}
                        {props.game.platforms &&
                            <div className={`platforms`}>
                                {props.game.platforms.map((platform: IdNamePair) => {
                                    if (platform.id === PlatformEnum.windows) return <i className="fab fa-windows mr-2"/>;
                                    if (platform.id === PlatformEnum.linux) return <i className="fab fa-linux mr-2"/>;
                                    if (platform.id === PlatformEnum.mac) return <i className="fab fa-apple mr-2"/>;
                                    })}
                            </div>}
                            <PriceContainer 
                                game={props.game}
                                showTextStatus={true}
                            />
                    </div>
                </>
            </div>
        </div>
    );

};

export default CoverFullsizeGame;
