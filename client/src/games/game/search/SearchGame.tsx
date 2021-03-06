import * as React from 'react';
import { GameResponse, PlatformEnum, IdNamePair } from '../../../../client-server-common/common';
import { Textfit } from 'react-textfit';
import Crossfade from '../crossfade/CrossfadeContainer';
import PriceContainer from '../../price/PriceContainer';

interface ISearchGameProps {
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

const SearchGame: React.SFC<ISearchGameProps> = (props: ISearchGameProps) => {
    return (
        <div className={`search-game-${props.index} position-relative bg-transparent cursor-pointer`}>
            <div className="screenshot w-100" onClick={props.goToGame} onMouseOver={props.onHoverGame} onMouseOut={props.onHoverOutGame}>
                <Crossfade src={[props.game.cover, ...props.game.screenshots]} index={props.hoveredScreenshotIndex} />
            </div>
            <div className={`overlay ${props.hovering ? 'hovering' : ''}`}/>
            <div className="highlighted-table-text p-3">
                <>
                    <Textfit className="name" min={11} max={15}>
                        {props.game.name}
                    </Textfit>
                    <div className="game-info-container">
                        {props.game.genres.length > 0 &&
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
                        <div className={`release-date`}>
                            {props.game.first_release_date
                                ? new Date(new Date(props.game.first_release_date).getTime() - (new Date(props.game.first_release_date).getTimezoneOffset() * 60000 )).toISOString().split("T")[0]
                                : 'TBA'}
                        </div>
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

export default SearchGame;
