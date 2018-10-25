const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ThumbnailGameResponse, ThumbnailGamesResponse, PredefinedGamesType } from '../../../../client-server-common/common';
import Results from './Results';

enum ResultsType {
    SearchResults,
    PredefinedRecentResults,
    PredefinedUpcomingResults,
    PredefinedPopularResults
}

interface IResultsContainerProps extends RouteComponentProps<any> {
    
}

interface IResultsContainerState {
    isLoading: boolean;
    currentQueryPath: string;
    resultsType: ResultsType;
    title: string;
    games: ThumbnailGameResponse[];
}

class ResultsContainer extends React.Component<IResultsContainerProps, IResultsContainerState> {

    constructor(props: IResultsContainerProps) {
        super(props);
        this.loadSearchGames = this.loadSearchGames.bind(this);
        this.loadPredefinedGames = this.loadPredefinedGames.bind(this);
        
        const predefinedTypeRaw: string = props.match.params.type;
        let predefinedType: PredefinedGamesType;
        let resultsType: ResultsType;
        let resultsTitle: string;

        if (props.match.params.type) {
            if (predefinedTypeRaw === 'recent') {
                predefinedType = PredefinedGamesType.Recent;
                resultsType = ResultsType.PredefinedRecentResults;
                resultsTitle = 'Recently released';
            } else if (predefinedTypeRaw === 'upcoming') {
                predefinedType = PredefinedGamesType.Upcoming;
                resultsType = ResultsType.PredefinedUpcomingResults;
                resultsTitle = 'Upcoming games';
            } else if (predefinedTypeRaw === 'popular') {
                predefinedType = PredefinedGamesType.Popular;
                resultsType = ResultsType.PredefinedPopularResults;
                resultsTitle = 'Popular games';
            }
        } else {
            resultsType = ResultsType.SearchResults;
            resultsTitle = 'Search results';
        }

        if (resultsType === ResultsType.SearchResults) {
            this.loadSearchGames(props.location.search);
        } else {
            this.loadPredefinedGames(predefinedType);
        }

        this.state = {
            isLoading: true,
            currentQueryPath: props.location.search,
            resultsType: resultsType,
            title: resultsTitle,
            games: undefined
        };
    }

    componentWillReceiveProps(newProps: IResultsContainerProps): void {
        const oldQueryPath: string = this.state.currentQueryPath;
        const newQueryPath: string = newProps.location.search;

        if (oldQueryPath !== newQueryPath) {
            this.setState({ isLoading: true, currentQueryPath: newQueryPath }, () => {
                this.loadSearchGames(newQueryPath);
            });
        }
    }

    loadSearchGames(queryString: string): void {
        
        IGDBService.httpGenericGetData<ThumbnailGamesResponse>(`/igdb/games/results/${queryString}`)
            .then( (response: ThumbnailGamesResponse) => {
                const games: ThumbnailGameResponse[] = response.data;
                this.setState({ isLoading: false, games: games });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false });
            });
    }

    loadPredefinedGames(type: PredefinedGamesType): void {

        IGDBService.httpGetPredefinedGamesResults(type)
            .then( (response: ThumbnailGamesResponse) => {
                const games: ThumbnailGameResponse[] = response.data;
                this.setState({ isLoading: false, games: games });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <Results
                isLoading={this.state.isLoading}
                title={this.state.title}
                games={this.state.games}
            />
        );
    }

}

export default withRouter(ResultsContainer);