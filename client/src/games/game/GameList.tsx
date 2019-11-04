import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import { GameListType } from './GameListContainer';
import FullsizeGameContainer from './fullsize/FullsizeGameContainer';
import SearchGameContainer from './search/SearchGameContainer';
import TransparentGameContainer from './transparent/TransparentGameContainer';
import TransparentTimeGameContainer from './transparenttime/TransparentTimeGameContainer';
import CoverGameContainer from './cover/CoverGameContainer';
import CoverScrollingGameContainer from './coverscrolling/CoverScrollingGameContainer';

interface IGameListProps {
    type: GameListType;
    game: GameResponse;
    goToGame: () => void;
    getConvertedPrice: (price: number) => string;
    index?: number;

}

const GameList: React.SFC<IGameListProps> = (props: IGameListProps) => {

    if (props.type === GameListType.FullsizeScreenshot) {
        return (
            <FullsizeGameContainer
                game={props.game}
                index={props.index}
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
            />
        );
    } else if (props.type === GameListType.FullsizeCover) {
        return (
            <CoverGameContainer
                game={props.game}
                index={props.index}
                getConvertedPrice={props.getConvertedPrice}
            />
        );
    } else if (props.type === GameListType.ScrollingCover) {
        return (
            <CoverScrollingGameContainer
                game={props.game}
                index={props.index}
            />
        );
    } else {
        return (
            <TransparentTimeGameContainer
                game={props.game}
                getConvertedPrice={props.getConvertedPrice}
            />
        );
    }

};

export default GameList;