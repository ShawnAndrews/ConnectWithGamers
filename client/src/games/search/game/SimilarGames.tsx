import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import { Grid } from '@material-ui/core';

interface ISimilarGamesProps {
    similar_games: GameResponse[];
    goToGame: (id: number) => void;
}

const SimilarGames: React.SFC<ISimilarGamesProps> = (props: ISimilarGamesProps) => {

    if (!props.similar_games) {
        return (<Spinner className="text-center my-4" loadingMsg="Loading similar games..."/>);
    }

    return (
        <div className="similar-games">
            {props.similar_games.length === 0 &&
                <h3 className="text-center my-4">Game does not have any similar games.</h3>}
            {props.similar_games.length > 0 && 
                <Grid className="similar-games" container spacing={8}>
                    {props.similar_games
                        .map((x: GameResponse, index: number) => (
                            <Grid key={index} item lg={6} xl={4}>
                                <img className="w-100" src={x.cover} onClick={() => props.goToGame(x.steamId)}/>
                            </Grid>
                        ))}
                </Grid>}
        </div>
    );

};

export default SimilarGames;