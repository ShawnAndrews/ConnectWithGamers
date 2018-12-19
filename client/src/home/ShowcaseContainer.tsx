const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Showcase from './Showcase';
import { PredefinedGameResponse, PredefinedGamesResponse, SingleNewsResponse, MultiNewsResponse } from '../../client-server-common/common';

interface IShowcaseContainerProps extends RouteComponentProps<any> {
    
}

interface IShowcaseContainerState {
    isLoading: boolean;
    reviewedGames: PredefinedGameResponse[];
    popularGames: PredefinedGameResponse[];
    recentGames: PredefinedGameResponse[];
    upcomingGames: PredefinedGameResponse[];
    news: SingleNewsResponse[];
}

class ShowcaseContainer extends React.Component<IShowcaseContainerProps, IShowcaseContainerState> {

    constructor(props: IShowcaseContainerProps) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);

        this.state = {
            isLoading: true,
            reviewedGames: undefined,
            popularGames: undefined,
            recentGames: undefined,
            upcomingGames: undefined,
            news: undefined
        };
    }

    componentDidMount(): void {
        const showcasePromises: Promise<any>[] = [];

        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/reviewed`));
        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/popular`));
        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/recent`));
        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/upcoming`));
        showcasePromises.push(IGDBService.httpGenericGetData<MultiNewsResponse>(`/igdb/games/news`));

        Promise.all(showcasePromises)
            .then((vals: any) => {
                let reviewedGames: PredefinedGameResponse[] = undefined;
                let popularGames: PredefinedGameResponse[] = undefined;
                let recentGames: PredefinedGameResponse[] = undefined;
                let upcomingGames: PredefinedGameResponse[] = undefined;
                let news: SingleNewsResponse[] = undefined;

                if (vals[0]) {
                    const response: PredefinedGamesResponse = vals[0];
                    const numOfReviewedGamesToShow: number = 6;
                    reviewedGames = response.data.slice(0, numOfReviewedGamesToShow);
                }
                if (vals[1]) {
                    const response: PredefinedGamesResponse = vals[1];
                    const numOfPopularGamesToShow: number = 20;
                    popularGames = response.data.slice(0, numOfPopularGamesToShow);
                }
                if (vals[2]) {
                    const response: PredefinedGamesResponse = vals[2];
                    const numOfRecentGamesToShow: number = 6;
                    recentGames = response.data.slice(0, numOfRecentGamesToShow);
                }
                if (vals[3]) {
                    const response: PredefinedGamesResponse = vals[3];
                    const numOfUpcomingGamesToShow: number = 6;
                    upcomingGames = response.data.slice(0, numOfUpcomingGamesToShow);
                }
                if (vals[4]) {
                    const response: MultiNewsResponse = vals[4];
                    const numOfNewsArticlesToShow: number = 8;
                    news = response.data.slice(0, numOfNewsArticlesToShow);
                }

                this.setState({
                    isLoading: false,
                    reviewedGames: reviewedGames,
                    popularGames: popularGames,
                    recentGames: recentGames,
                    upcomingGames: upcomingGames,
                    news: news
                });
            })
            .catch((error: string) => {
                popupS.modal({ content: `<div>• Error loading menu.</div>` });
            });
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    render() {
        return (
            <Showcase
                isLoading={this.state.isLoading}
                goToRedirect={this.goToRedirect}
                reviewedGames={this.state.reviewedGames}
                popularGames={this.state.popularGames}
                recentGames={this.state.recentGames}
                upcomingGames={this.state.upcomingGames}
                news={this.state.news}
            />
        );
    }

}

export default withRouter(ShowcaseContainer);