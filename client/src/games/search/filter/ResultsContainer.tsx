const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, ResultsEnum, GamesPresets } from '../../../../client-server-common/common';
import Results from './Results';
import { SortingOptionEnum } from '../../sidenav/filter/FilterContainer';

interface IResultsContainerProps extends RouteComponentProps<any> {
    
}

interface IResultsContainerState {
    isLoading: boolean;
    searchQuery: string;
    games: GameResponse[];
    retry: boolean;
    sortingSelection: SortingOptionEnum;
}

class ResultsContainer extends React.Component<IResultsContainerProps, IResultsContainerState> {

    constructor(props: IResultsContainerProps) {
        super(props);
        this.loadSearchGames = this.loadSearchGames.bind(this);
        this.onRetryClick = this.onRetryClick.bind(this);
        this.onSortingSelectionChange = this.onSortingSelectionChange.bind(this);
        
        const searchQuery: string = props.location.search;
        this.loadSearchGames(searchQuery);

        this.state = {
            isLoading: true,
            searchQuery: searchQuery,
            games: undefined,
            retry: false,
            sortingSelection: SortingOptionEnum.None
        };
    }

    componentWillReceiveProps(newProps: IResultsContainerProps): void {
        const newSearchQuery: string = newProps.location.search;

        if ( this.state.searchQuery != newSearchQuery) {

            this.setState({
                isLoading: true,
                searchQuery: newSearchQuery,
                games: undefined,
                sortingSelection: SortingOptionEnum.None,
            }, () => this.loadSearchGames(newSearchQuery));
        }
    }

    onSortingSelectionChange(event: any): void {
        this.setState({
            sortingSelection: event.target.value
        });
    }

    getLocalSortType(queryString: string): string {
        const foundSearchIndex: number = queryString.indexOf("query=");
        const foundSortIndex: number = queryString.indexOf("sort=");
        if (foundSearchIndex !== -1 && foundSortIndex !== -1) {
            queryString = queryString.substring(foundSortIndex + 5);
            const foundSortEndIndex: number = queryString.indexOf("&");
            if (foundSortEndIndex !== -1) {
                queryString = queryString.substring(0, foundSortEndIndex);
            }
            return queryString;
        }
        return undefined;
    }

    loadSearchGames(queryString: string): void {
        
        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${queryString}`)
            .then( (response: MultiGameResponse) => {
                const games: GameResponse[] = response.data;
                const localSort: string = this.getLocalSortType(queryString);
                
                if (localSort) {
                    const split: string[] = localSort.split(":");
                    const type: string = split[0];
                    const order: string = split[1];
                    let propertyToSort: string;

                    if (type === "alphabetic") {
                        propertyToSort = "name";
                    } else if (type === "popularity") {
                        propertyToSort = "aggregated_rating";
                    } else if (type === "release_date") {
                        propertyToSort = "first_release_date";
                    }

                    games.sort((x: GameResponse, y: GameResponse) => {
                        if (order === "asc" ? x[propertyToSort] > y[propertyToSort] : x[propertyToSort] > y[propertyToSort]) {
                            return -1;
                        } else if (order === "asc" ? x[propertyToSort] < y[propertyToSort] : x[propertyToSort] > y[propertyToSort]) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                }

                this.setState({ isLoading: false, games: games });
            })
            .catch( (error: string) => {
                let retry: boolean = error === "Retry";
                if (!retry) {
                    popupS.modal({ content: `<div>• ${error}</div>` });
                }
                this.setState({ isLoading: false, retry: retry});
            });
            
    }

    onRetryClick(): void {
        this.setState({ isLoading: true, retry: false }, () => {
            this.loadSearchGames(this.props.location.search);
        });
    }

    render() {
        return (
            <Results
                isLoading={this.state.isLoading}
                games={this.state.games}
                retry={this.state.retry}
                onRetryClick={this.onRetryClick}
                sortingSelection={this.state.sortingSelection}
                onSortingSelectionChange={this.onSortingSelectionChange}
            />
        );
    }

}

export default withRouter(ResultsContainer);