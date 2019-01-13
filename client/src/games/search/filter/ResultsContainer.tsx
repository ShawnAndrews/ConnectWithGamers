const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, ResultsType, GamesPresets } from '../../../../client-server-common/common';
import Results from './Results';

interface IResultsContainerProps extends RouteComponentProps<any> {
    
}

interface IResultsContainerState {
    isLoading: boolean;
    searchQuery: string;
    resultsType: ResultsType;
    games: GameResponse[];
    retry: boolean;
}

class ResultsContainer extends React.Component<IResultsContainerProps, IResultsContainerState> {

    constructor(props: IResultsContainerProps) {
        super(props);
        this.loadSearchGames = this.loadSearchGames.bind(this);
        this.loadGames = this.loadGames.bind(this);
        this.onRetryClick = this.onRetryClick.bind(this);
        this.getResultsTypeByProps = this.getResultsTypeByProps.bind(this);

        const resultsType: ResultsType = this.getResultsTypeByProps(props);

        if (resultsType === ResultsType.SearchResults) {
            this.loadSearchGames(props.location.search);
        } else {
            this.loadGames(resultsType);
        }

        this.state = {
            isLoading: true,
            searchQuery: props.location.search,
            resultsType: resultsType,
            games: undefined,
            retry: false
        };
    }

    componentWillReceiveProps(newProps: IResultsContainerProps): void {
        const newResultsType: ResultsType = this.getResultsTypeByProps(newProps);
        const newSearchQuery: string = newProps.location.search;

        if (this.state.resultsType !== newResultsType || this.state.searchQuery != newSearchQuery) {
            if (newResultsType === ResultsType.SearchResults) {
                this.loadSearchGames(newSearchQuery);
            } else {
                this.loadGames(newResultsType);
            }

            this.setState({
                isLoading: true,
                searchQuery: newSearchQuery,
                resultsType: newResultsType
            });
        }
    }

    getResultsTypeByProps(someProps: IResultsContainerProps): ResultsType {
        const typeRaw: string = someProps.match.params.type;
        let resultsType: ResultsType;
        
        if (typeRaw) {
            if (typeRaw === 'recent') {
                resultsType = ResultsType.RecentResults;
            } else if (typeRaw === 'upcoming') {
                resultsType = ResultsType.UpcomingResults;
            } else if (typeRaw === 'popular') {
                resultsType = ResultsType.PopularResults;
            }
        } else {
            resultsType = ResultsType.SearchResults;
        }

        return resultsType;
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

    loadGames(type: ResultsType): void {

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets[type]}`)
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data;
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
                resultsType={this.state.resultsType}
            />
        );
    }

}

export default withRouter(ResultsContainer);