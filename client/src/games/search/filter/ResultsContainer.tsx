const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, ResultsType } from '../../../../client-server-common/common';
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

    loadSearchGames(queryString: string): void {
        
        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${queryString}`)
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

    loadGames(type: ResultsType): void {

        IGDBService.httpGetGamesResults(type)
            .then( (response: MultiGameResponse) => {
                const games: GameResponse[] = response.data;
                this.setState({ isLoading: false, games: games });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false });
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