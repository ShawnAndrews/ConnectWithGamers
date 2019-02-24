import * as React from 'react';
import { GameResponse, ResultsEnum } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import RegularGameContainer from '../../game/regular/RegularGameContainer';
import TopnavContainer from './topnav/TopnavContainer';
import { Paper, Button } from '@material-ui/core';
import { SortingOptionEnum } from '../../sidenav/filter/FilterContainer';

interface IResultsProps {
    isLoading: boolean;
    games: GameResponse[];
    retry: boolean;
    onRetryClick: () => void;
    onSortingSelectionChange: (event: any) => void;
    sortingSelection: SortingOptionEnum;
}

const Results: React.SFC<IResultsProps> = (props: IResultsProps) => {
    
    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5 pt-5" loadingMsg="Loading results..." />
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
    
    let sortedGames: GameResponse[] = props.games;

    if (props.sortingSelection !== SortingOptionEnum.None) {

        sortedGames = sortedGames
            .sort((a: GameResponse, b: GameResponse) => {

                if (props.sortingSelection === SortingOptionEnum.ReleaseDateAsc) {
                    return a.first_release_date - b.first_release_date;
                } else if (props.sortingSelection === SortingOptionEnum.ReleaseDateDesc) {
                    return b.first_release_date - a.first_release_date;
                } else if (props.sortingSelection === SortingOptionEnum.AlphabeticallyAsc) {
                    if (a.name > b.name) { return -1; }
                    if (a.name < b.name) { return 1; }
                    return 0;
                } else if (props.sortingSelection === SortingOptionEnum.AlphabeticallyDesc) {
                    if (a.name < b.name) { return -1; }
                    if (a.name > b.name) { return 1; }
                    return 0;
                } else if (props.sortingSelection === SortingOptionEnum.PopularityAsc) {
                    return (a.aggregated_rating || 0) - (b.aggregated_rating || 0);
                } else if (props.sortingSelection === SortingOptionEnum.PopularityDesc) {
                    return (b.aggregated_rating || 0) - (a.aggregated_rating || 0);
                } else {
                    return 0; // never hit
                }

            });
    }

    return (
        <Paper className="results bg-primary-solid overflow-auto" elevation={24}>
            <TopnavContainer
                title="Search results"
                onSortingSelectionChange={props.onSortingSelectionChange}
                sortingSelection={props.sortingSelection}
            />
            <div className="row w-100 m-0">
                {sortedGames && 
                    sortedGames
                        .map((game: GameResponse) => {
                            return (
                                <RegularGameContainer
                                    key={game.id}
                                    game={game}
                                />
                            );
                        })
                    }
            </div>
        </Paper>
    );

}; 

export default Results;