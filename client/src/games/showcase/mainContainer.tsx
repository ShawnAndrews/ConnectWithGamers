const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Main from './main';
import { GameResponse, MultiGameResponse, NewsArticle, MultiNewsResponse, GamesPresets, ExcludedGameIds } from '../../../client-server-common/common';

interface IMainContainerProps extends RouteComponentProps<any> {
    
}

interface IMainContainerState {
    isLoading: boolean;
    highlightedGames: GameResponse[];
    popularGames: GameResponse[];
    recentGames: GameResponse[];
    upcomingGames: GameResponse[];
    discountedGames: GameResponse[];
    news: NewsArticle[];
}

class MainContainer extends React.Component<IMainContainerProps, IMainContainerState> {

    constructor(props: IMainContainerProps) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);

        this.state = {
            isLoading: true,
            highlightedGames: undefined,
            popularGames: undefined,
            recentGames: undefined,
            upcomingGames: undefined,
            discountedGames: undefined,
            news: undefined
        };
    }

    componentDidMount(): void {
        const promises: Promise<any>[] = [];

        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.highlighted}`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.popular}`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.recentlyReleased}`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.upcoming}`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/discounted`));
        promises.push(IGDBService.httpGenericGetData<MultiNewsResponse>(`/igdb/games/news`));

        Promise.all(promises)
            .then((vals: any) => {
                let highlightedGames: GameResponse[] = undefined;
                let popularGames: GameResponse[] = undefined;
                let recentGames: GameResponse[] = undefined;
                let upcomingGames: GameResponse[] = undefined;
                let discountedGames: GameResponse[] = undefined;
                let news: NewsArticle[] = undefined;

                if (vals[0]) {
                    const response: MultiGameResponse = vals[0];
                    response.data = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);
                    const numOfHighlightedGamesToShow: number = 9;
                    highlightedGames = response.data.slice(0, numOfHighlightedGamesToShow);
                }
                if (vals[1]) {
                    const response: MultiGameResponse = vals[1];
                    response.data = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);
                    const numOfPopularGamesToShow: number = 20;
                    popularGames = response.data.slice(0, numOfPopularGamesToShow);
                }
                if (vals[2]) {
                    const response: MultiGameResponse = vals[2];
                    response.data = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);
                    recentGames = response.data.sort((x: GameResponse, y: GameResponse) => y.first_release_date - x.first_release_date);
                }
                if (vals[3]) {
                    const response: MultiGameResponse = vals[3];
                    response.data = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);
                    upcomingGames = response.data.sort((x: GameResponse, y: GameResponse) => x.first_release_date - y.first_release_date);
                }
                if (vals[4]) {
                    const response: MultiGameResponse = vals[4];
                    response.data = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);
                    discountedGames = response.data;
                }
                if (vals[5]) {
                    const response: MultiNewsResponse = vals[5];
                    const numOfNewsArticlesToShow: number = 8;
                    news = response.data.slice(0, numOfNewsArticlesToShow);
                }

                this.setState({
                    isLoading: false,
                    highlightedGames: highlightedGames,
                    popularGames: popularGames,
                    recentGames: recentGames,
                    upcomingGames: upcomingGames,
                    discountedGames: discountedGames,
                    news: news
                });
            })
            .catch((error: any) => {
                popupS.modal({ content: `<div>• Error loading menu.</div>` });
            });
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    render() {
        return (
            <Main
                isLoading={this.state.isLoading}
                goToRedirect={this.goToRedirect}
                highlightedGames={this.state.highlightedGames}
                popularGames={this.state.popularGames}
                recentGames={this.state.recentGames}
                upcomingGames={this.state.upcomingGames}
                discountedGames={this.state.discountedGames}
                news={this.state.news}
            />
        );
    }

}

export default withRouter(MainContainer);