import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import { GameListType } from './GameListContainer';
import CoverSmallGameContainer from './coversmall/CoverSmallGameContainer';
import SearchGameContainer from './search/SearchGameContainer';
import TransparentGameContainer from './transparent/TransparentGameContainer';
import TransparentTimeGameContainer from './transparenttime/TransparentTimeGameContainer';
import CoverFullsizeGameContainer from './coverfullsize/CoverFullsizeGameContainer';
import CoverScrollingGameContainer from './coverscrolling/CoverScrollingGameContainer';

interface IGameListProps {
    type: GameListType;
    game: GameResponse;
    goToGame: () => void;
    index: number;
}

const GameList: React.SFC<IGameListProps> = (props: IGameListProps) => {

    if (props.type === GameListType.SmallCover) {
        return (
            <CoverSmallGameContainer
                index={props.index}
                game={props.game}
            />
        );
    } else if (props.type === GameListType.Search) {
        return (
            <SearchGameContainer
                game={props.game}
                index={props.index}
            />
        );
    } else if (props.type === GameListType.Transparent) {
        return (
            <TransparentGameContainer
                game={props.game}
            />
        );
    } else if (props.type === GameListType.FullsizeCover) {
        return (
            <CoverFullsizeGameContainer
                game={props.game}
                index={props.index}
            />
        );
    } else if (props.type === GameListType.ScrollingCover) {
        return (
            <CoverScrollingGameContainer
                index={props.index}
                game={props.game}
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