import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import TopnavContainer from './topnav/TopnavContainer';
import { Paper } from '@material-ui/core';
import { SortingOptionEnum } from '../../sidenav/filter/FilterContainer';
import GameListContainer, { GameListType } from '../../game/GameListContainer';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

interface IResultsProps {
    isLoading: boolean;
    games: GameResponse[];
    retry: boolean;
    onRetryClick: () => void;
    onSortingSelectionChange: (event: any) => void;
    sortingSelection: SortingOptionEnum;
    onChangePage: (page: number, pageSize: number) => void;
    currentPage: number;
}

const Results: React.SFC<IResultsProps> = (props: IResultsProps) => {
    
    const pageSize: number = 28;

    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5 pt-5" loadingMsg="Loading results..." />
        );
    }

    let sortedGames: GameResponse[] = props.games;

    if (props.sortingSelection !== SortingOptionEnum.None) {

        sortedGames = sortedGames
            .sort((a: GameResponse, b: GameResponse) => {

                if (props.sortingSelection === SortingOptionEnum.ReleaseDateAsc) {
                    return new Date(a.first_release_date).getTime() - new Date(b.first_release_date).getTime();
                } else if (props.sortingSelection === SortingOptionEnum.ReleaseDateDesc) {
                    return new Date(b.first_release_date).getTime() - new Date(a.first_release_date).getTime();
                } else if (props.sortingSelection === SortingOptionEnum.AlphabeticallyAsc) {
                    if (a.name > b.name) { return -1; }
                    if (a.name < b.name) { return 1; }
                    return 0;
                } else if (props.sortingSelection === SortingOptionEnum.AlphabeticallyDesc) {
                    if (a.name < b.name) { return -1; }
                    if (a.name > b.name) { return 1; }
                    return 0;
                } else if (props.sortingSelection === SortingOptionEnum.PopularityAsc) {
                    return (b.review.id === 1 ? 11 : b.review.id) - (a.review.id === 1 ? 11 : a.review.id);
                } else if (props.sortingSelection === SortingOptionEnum.PopularityDesc) {
                    return (a.review.id === 1 ? 11 : a.review.id) - (b.review.id === 1 ? 11 : b.review.id);
                } else {
                    return 0; // never hit
                }

            });
    }

    return (
        <Paper className="results bg-primary-solid overflow-auto">
            <TopnavContainer
                title="Search results"
                onSortingSelectionChange={props.onSortingSelectionChange}
                sortingSelection={props.sortingSelection}
                totalGames={props.games.length}
            />
            <div className="row w-100 m-0">
                {sortedGames && 
                    sortedGames
                        .map((game: GameResponse) => {
                            return (
                                <GameListContainer
                                    key={game.steamId}
                                    type={GameListType.Search}
                                    game={game}
                                />
                            );
                        })
                        .slice(pageSize * (props.currentPage - 1), Math.ceil(sortedGames.length / pageSize) !== props.currentPage ? (pageSize * (props.currentPage - 1) + pageSize) : sortedGames.length)
                    }
            </div>
            <div className="pagination-container text-center my-4">
                <Pagination
                    className="pagination"
                    showTitle={false}
                    defaultCurrent={props.currentPage}
                    total={props.games.length}
                    onChange={props.onChangePage}
                    pageSize={pageSize}
                />
            </div>
        </Paper>
    );

}; 

export default Results;