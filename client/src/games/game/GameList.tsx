import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import { GameListType } from './GameListContainer';
import FullsizeGameContainer from './fullsize/FullsizeGameContainer';
import SearchGameContainer from './search/SearchGameContainer';
import TransparentGameContainer from './transparent/TransparentGameContainer';
import TransparentTimeGameContainer from './transparenttime/TransparentTimeGameContainer';
import CoverGameContainer from './cover/CoverGameContainer';

interface IGameListProps {
    type: GameListType;
    game: GameResponse;
    goToGame: () => void;
    fullsizeIndex?: number;
    fullsizeIsEditorsChoiceGame?: boolean;
    fullsizeIsBigGame?: boolean;
    transparentSmallCover?: boolean;
}

const GameList: React.SFC<IGameListProps> = (props: IGameListProps) => {

    if (props.type === GameListType.FullsizeScreenshot) {
        return (
            <FullsizeGameContainer
                game={props.game}
                index={props.fullsizeIndex}
                isEditorsChoiceGame={props.fullsizeIsEditorsChoiceGame}
                isBigGame={props.fullsizeIsBigGame}
            />
        );
    } else if (props.type === GameListType.Search) {
        return (
            <SearchGameContainer
                game={props.game}
            />
        );
    } else if (props.type === GameListType.Transparent) {
        return (
            <TransparentGameContainer
                game={props.game}
                transparentSmallCover={props.transparentSmallCover}
            />
        );
    } else if (props.type === GameListType.FullsizeCover) {
        return (
            <CoverGameContainer
                game={props.game}
                index={props.fullsizeIndex}
                isEditorsChoiceGame={props.fullsizeIsEditorsChoiceGame}
                isBigGame={props.fullsizeIsBigGame}
            />
        );
    } else {
        return (
            <TransparentTimeGameContainer
                game={props.game}
            />
        );
    }

};

export default GameList;