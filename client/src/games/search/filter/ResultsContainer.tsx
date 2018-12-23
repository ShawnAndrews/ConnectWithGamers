const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, GamesType } from '../../../../client-server-common/common';
import Results from './Results';

enum ResultsType {
    SearchResults,
    RecentResults,
    UpcomingResults,
    PopularResults
}

interface IResultsContainerProps extends RouteComponentProps<any> {
    
}

interface IResultsContainerState {
    isLoading: boolean;
    currentQueryPath: string;
    resultsType: ResultsType;
    title: string;
    games: GameResponse[];
}

class ResultsContainer extends React.Component<IResultsContainerProps, IResultsContainerState> {

    constructor(props: IResultsContainerProps) {
        super(props);
        this.loadSearchGames = this.loadSearchGames.bind(this);
        this.loadGames = this.loadGames.bind(this);
        this.getTitle = this.getTitle.bind(this);

        const typeRaw: string = props.match.params.type;
        const resultsTitle: string = this.getTitle(props);
        let type: GamesType;
        let resultsType: ResultsType;

        if (typeRaw) {
            if (typeRaw === 'recent') {
                type = GamesType.Recent;
                resultsType = ResultsType.RecentResults;
            } else if (typeRaw === 'upcoming') {
                type = GamesType.Upcoming;
                resultsType = ResultsType.UpcomingResults;
            } else if (typeRaw === 'popular') {
                type = GamesType.Popular;
                resultsType = ResultsType.PopularResults;
            }
        } else {
            resultsType = ResultsType.SearchResults;
        }

        if (resultsType === ResultsType.SearchResults) {
            this.loadSearchGames(props.location.search);
        } else {
            this.loadGames(type);
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
        
        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${queryString}`)
            .then( (response: MultiGameResponse) => {
                const games: GameResponse[] = response.data;
                this.setState({ isLoading: false, games: games });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false });
            });
    }

    loadGames(type: GamesType): void {

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

    getTitle(props: IResultsContainerProps): string {
        const typeRaw: string = props.match.params.type;
        let title: string;

        if (typeRaw) {
            if (typeRaw === 'recent') {
                title = 'Recently released';
            } else if (typeRaw === 'upcoming') {
                title = 'Upcoming games';
            } else if (typeRaw === 'popular') {
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