import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import GameListContainer, { GameListType } from '../../game/GameListContainer';

interface IHomeMenusProps {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    retry: boolean;
    onRetryClick: () => void;
    editorsGamesIndicies: number[];
    bigGamesIndicies: number[];
}

const HomeMenu: React.SFC<IHomeMenusProps> = (props: IHomeMenusProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5 pt-5" loadingMsg={props.loadingMsg} />
        );
    }

    return (
        <div className="grid-results games m-4">
            {props.games && props.games
                .map((game: GameResponse, index: number) => (
                    <GameListContainer
                        type={GameListType.FullsizeScreenshot}
                        game={game}
                        index={index}
                    />
                ))}
        </div>
    );

}; 

export default HomeMenu;