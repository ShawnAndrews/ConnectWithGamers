import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import { Paper, Button } from '@material-ui/core';
import FullsizeGameContainer from '../../game/fullsize/FullsizeGameContainer';

interface IFullsizeResultsProps {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    retry: boolean;
    onRetryClick: () => void;
    editorsGamesIndicies: number[];
    featureGamesIndicies: number[];
    subFeatureGamesIndicies: number[];
}

const FullsizeResults: React.SFC<IFullsizeResultsProps> = (props: IFullsizeResultsProps) => {

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
        <div className="fullsize-results">
            {props.games && props.games
                .map((game: GameResponse, index: number) => {
                    const isEditorsChoiceGame: boolean = props.editorsGamesIndicies.findIndex((x: number) => x === index) !== -1;
                    const isFeatureGame: boolean = props.featureGamesIndicies.findIndex((x: number) => x === index) !== -1;
                    const isSubFeatureGame: boolean = props.subFeatureGamesIndicies.findIndex((x: number) => x === index) !== -1;

                    return (
                        <FullsizeGameContainer
                            index={index}
                            game={game}
                            isEditorsChoiceGame={isEditorsChoiceGame}
                            isFeatureGame={isFeatureGame}
                            isSubFeatureGame={isSubFeatureGame}
                        />
                    );
                })}
        </div>
    );

}; 

export default FullsizeResults;