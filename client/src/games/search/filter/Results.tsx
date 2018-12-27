import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import ThumbnailGameContainer from '../../game/ThumbnailGameContainer';
import TopnavContainer from './topnav/TopnavContainer';
import { Paper, Button } from '@material-ui/core';

interface IResultsProps {
    isLoading: boolean;
    title: string;
    games: GameResponse[];
    retry: boolean;
    onRetryClick: () => void;
}

const Results: React.SFC<IResultsProps> = (props: IResultsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5" loadingMsg="Loading results..." />
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
        <div className="results container">
            <TopnavContainer
                title={props.title}
            />
            <div className="row">
                {props.games && 
                    props.games.map((game: GameResponse) => {
                        return (
                            <ThumbnailGameContainer
                                key={game.id}
                                game={game}
                            />
                        );
                    })}
            </div>
        </div>
    );

}; 

export default Results;