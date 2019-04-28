import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import { Paper, Button } from '@material-ui/core';
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

    if (props.retry) {
        return (
            <Paper className="retry color-secondary bg-tertiary p-3 mx-auto my-4">
                <div className="text-center">
                    Failed to connect to IGDB database. Please retry.
                </div>
                <Button className="color-primary bg-secondary-solid hover-secondary-solid mt-3" onClick={props.onRetryClick} variant="contained" color="primary" fullWidth={true}>
                    Retry
                </Button>
            </Paper>
        );
    }

    return (
        <div className="grid-results games">
            {props.games && props.games
                .map((game: GameResponse, index: number) => {
                    const isEditorsChoiceGame: boolean = props.editorsGamesIndicies.findIndex((x: number) => x === index) !== -1;
                    const isBigGame: boolean = props.bigGamesIndicies.findIndex((x: number) => x === index) !== -1;

                    return (
                        <GameListContainer
                            type={GameListType.Fullsize}
                            game={game}
                            fullsizeIndex={index}
                            fullsizeIsEditorsChoiceGame={isEditorsChoiceGame}
                            fullsizeIsBigGame={isBigGame}
                        />
                    );
                })}
        </div>
    );

}; 

export default HomeMenu;