import * as React from 'react';
import { GameResponse, ResultsType } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import ThumbnailGameContainer from '../../game/ThumbnailGameContainer';
import TopnavContainer from './topnav/TopnavContainer';
import { Paper, Button } from '@material-ui/core';

interface IResultsProps {
    isLoading: boolean;
    games: GameResponse[];
    retry: boolean;
    onRetryClick: () => void;
    resultsType: ResultsType;
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
    
    let title: string;

    if (props.resultsType === ResultsType.RecentResults) {
        title = 'Recently released';
    } else if (props.resultsType === ResultsType.UpcomingResults) {
        title = 'Upcoming games';
    } else if (props.resultsType === ResultsType.PopularResults) {
        title = 'Popular games';
    } else {
        title = 'Search results';
    }

    return (
        <Paper className="results bg-primary-solid overflow-auto" elevation={24}>
            <TopnavContainer
                title={title}
            />
            <div className="row w-100 m-0">
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
        </Paper>
    );

}; 

export default Results;