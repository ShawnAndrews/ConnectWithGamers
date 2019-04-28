import * as React from 'react';
import { GameResponse, GenreEnums, getCachedIGDBImage, IGDBImageSizeEnums, getIGDBImage } from '../../../client-server-common/common';
import { Paper } from '@material-ui/core';
import { Textfit } from 'react-textfit';
import { GameListType } from './GameListContainer';
import FullsizeGameContainer from './fullsize/FullsizeGameContainer';
import SearchGameContainer from './search/SearchGameContainer';
import TransparentGameContainer from './transparent/TransparentGameContainer';

interface IGameListProps {
    type: GameListType;
    game: GameResponse;
    goToGame: () => void;
    fullsizeIndex?: number;
    fullsizeIsEditorsChoiceGame?: boolean;
    fullsizeIsBigGame?: boolean;
}

const GameList: React.SFC<IGameListProps> = (props: IGameListProps) => {

    if (props.type === GameListType.Fullsize) {
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
    } else {
        return (
            <TransparentGameContainer
                game={props.game}
            />
        );
    }

};

export default GameList;