import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import Spinner from '../../../spinner/main';
import TopnavContainer from './topnav/TopnavContainer';
import GameListContainer, { GameListType } from '../../game/GameListContainer';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

interface IResultsProps {
    isLoading: boolean;
    games: GameResponse[];
    onChangePage: (page: number, pageSize: number) => void;
    currentPage: number;
    getConvertedPrice: (price: number) => string;
}

const Results: React.SFC<IResultsProps> = (props: IResultsProps) => {
    
    const pageSize: number = 28;

    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5 pt-5" loadingMsg="Loading results..." />
        );
    }

    let sortedGames: GameResponse[] = props.games;

    return (
        <div className="results overflow-auto">
            <TopnavContainer
                title="Search results"
                totalGames={props.games.length}
            />
            <div className="grid-results horizontal small w-100 m-0">
                {sortedGames && 
                    sortedGames
                        .map((game: GameResponse, index: number) => {
                            return (
                                <GameListContainer
                                    key={game.steamId}
                                    type={GameListType.Search}
                                    game={game}
                                    index={index}
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
        </div>
    );

}; 

export default Results;