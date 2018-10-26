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
        this.getTitle = this.getTitle.bind(this);

        const predefinedTypeRaw: string = props.match.params.type;
        const resultsTitle: string = this.getTitle(props);
        let predefinedType: PredefinedGamesType;
        let resultsType: ResultsType;

        if (predefinedTypeRaw) {
            if (predefinedTypeRaw === 'recent') {
                predefinedType = PredefinedGamesType.Recent;
                resultsType = ResultsType.PredefinedRecentResults;
            } else if (predefinedTypeRaw === 'upcoming') {
                predefinedType = PredefinedGamesType.Upcoming;
                resultsType = ResultsType.PredefinedUpcomingResults;
            } else if (predefinedTypeRaw === 'popular') {
                predefinedType = PredefinedGamesType.Popular;
                resultsType = ResultsType.PredefinedPopularResults;
            }
        } else {
            resultsType = ResultsType.SearchResults;
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
        const newTitle: string = this.getTitle(newProps);

        if (oldQueryPath !== newQueryPath) {
            this.setState({ isLoading: true, currentQueryPath: newQueryPath, title: newTitle }, () => {
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

    getTitle(props: IResultsContainerProps): string {
        const predefinedTypeRaw: string = props.match.params.type;
        let title: string;

        if (predefinedTypeRaw) {
            if (predefinedTypeRaw === 'recent') {
                title = 'Recently released';
            } else if (predefinedTypeRaw === 'upcoming') {
                title = 'Upcoming games';
            } else if (predefinedTypeRaw === 'popular') {
                title = 'Popular games';
            }
        } else {
            title = 'Search results';
        }

        return title;
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