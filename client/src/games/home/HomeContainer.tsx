const popupS = require('popups');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse, ExcludedGameIds, GenericModelResponse, NewsArticle, MultiNewsResponse, SidenavEnums, PriceInfoResponse } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';
import { getGameBestPricingStatus } from '../../util/main';

export enum TimeGamesOptions {
    Upcoming,
    Recent,
    Early
}

export interface BigGameInfo {
    gameId: number;
    btnLink: string;
    btnText: string;
}

interface IHomeContainerProps extends RouteComponentProps<any> {
    sidebarActiveEnum: SidenavEnums;
}

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    bigGamesInfo: BigGameInfo[];
    bigGames: GameResponse[];
    featuredGames: GameResponse[];
    featuredEditorsGamesIndicies: number[];
    featuredBigGamesIndicies: number[];
    news: NewsArticle[];
    weeklyGames: GameResponse[];
    timeGamesOption: TimeGamesOptions;
    upcomingGames: GameResponse[];
    recentGames: GameResponse[];
    earlyGames: GameResponse[];
    horrorGames: GameResponse[];
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);
        this.changeTimeGamesOption = this.changeTimeGamesOption.bind(this);
        this.goToOption = this.goToOption.bind(this);

        this.state = {
            isLoading: true,
            loadingMsg: 'Loading games...',
            bigGames: undefined,
            featuredGames: undefined,
            weeklyGames: undefined,
            upcomingGames: undefined,
            recentGames: undefined,
            earlyGames: undefined,
            horrorGames: undefined,
            news: undefined,
            timeGamesOption: TimeGamesOptions.Upcoming,
            bigGamesInfo: [
                { gameId: 22778, btnText: `Available March 26ᵗʰ`, btnLink: `https://store.steampowered.com/app/794260/Outward/` },
                { gameId: 27804, btnText: `Pre-order $39.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Fphoenix-point%2Fhome%3FpurchaseIntentId%3D75e9feab76fc46bb8ce6f3d7dadae3c8&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true` },
                { gameId: 113212, btnText: `Buy it now $29.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Foperencia%2Fhome%3FpurchaseIntentId%3D7d1d766667ef423bbd636ee6f054f755&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true` },
                { gameId: 26166, btnText: `Coming soon`, btnLink: `https://www.epicgames.com/store/en-US/product/dauntless/home`},
            ],
            featuredEditorsGamesIndicies: [0],
            featuredBigGamesIndicies: [0]
        };

    }

    componentDidMount(): void {
        let promises: Promise<any>[] = [];

        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/popular`));
        this.state.bigGamesInfo.forEach((x: BigGameInfo) => {
            promises.push(IGDBService.httpGenericGetData<GenericModelResponse>(`/igdb/game/${x.gameId}`));
        });
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/weeklydeals`));
        promises.push(IGDBService.httpGenericGetData<MultiNewsResponse>(`/igdb/games/news`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/upcoming`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/recent`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/earlyaccess`));
        promises.push(IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/horror`));

        Promise.all(promises)
            .then((data: any[]) => {
                const featuredGamesData: MultiGameResponse = data[0];
                const featuredGames: GameResponse[] = featuredGamesData.data
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                    .filter((game: GameResponse) => game.cover)
                    .sort((a: GameResponse, b: GameResponse) => b.aggregated_rating - a.aggregated_rating)
                    .slice(0, 9);
                const bigGamesData: GenericModelResponse[] = data.slice(1, 1 + this.state.bigGamesInfo.length);
                const bigGames: GameResponse[] = [];
                bigGamesData.forEach((x: GenericModelResponse) => {
                    const game: GameResponse = x.data;
                    this.state.bigGamesInfo.forEach((y: BigGameInfo) => {
                        if (game.id === y.gameId) {
                            bigGames.push(x.data);
                        }
                    });
                });
                const weeklyGamesData: MultiGameResponse = data[1 + this.state.bigGamesInfo.length];
                const weeklyGames: GameResponse[] = weeklyGamesData.data
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                    .filter((game: GameResponse) => game.cover);
                const newsData: MultiNewsResponse = data[2 + this.state.bigGamesInfo.length];
                const news: NewsArticle[] = newsData.data;
                const upcomingGamesData: MultiGameResponse = data[3 + this.state.bigGamesInfo.length];
                const upcomingGames: GameResponse[] = upcomingGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => (game.cover.width / game.cover.height) <= 0.8)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                    .sort((a: GameResponse, b: GameResponse) => a.first_release_date - b.first_release_date)
                    .slice(0, 20);
                const recentGamesData: MultiGameResponse = data[4 + this.state.bigGamesInfo.length];
                const recentGames: GameResponse[] = recentGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => (game.cover.width / game.cover.height) <= 0.8)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                    .sort((a: GameResponse, b: GameResponse) => b.first_release_date - a.first_release_date)
                    .slice(0, 20);
                const earlyGamesData: MultiGameResponse = data[5 + this.state.bigGamesInfo.length];
                const earlyGames: GameResponse[] = earlyGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => (game.cover.width / game.cover.height) <= 0.8)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                    .sort((a: GameResponse, b: GameResponse) => a.first_release_date - b.first_release_date)
                    .slice(0, 20);
                const horrorGamesData: MultiGameResponse = data[6 + this.state.bigGamesInfo.length];
                const horrorGames: GameResponse[] = horrorGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => (game.cover.width / game.cover.height) <= 0.8)
                    .filter((game: GameResponse) => getGameBestPricingStatus(game.pricings).discount_percent && getGameBestPricingStatus(game.pricings).discount_percent > 0)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                    .sort((a: GameResponse, b: GameResponse) => {
                        const bestPriceA: PriceInfoResponse = getGameBestPricingStatus(a.pricings);
                        const bestPriceB: PriceInfoResponse = getGameBestPricingStatus(b.pricings);
                        return bestPriceB.discount_percent - bestPriceA.discount_percent;
                    })
                    .slice(0, 4);

                this.setState({
                    isLoading: false,
                    bigGames: bigGames,
                    featuredGames: featuredGames,
                    weeklyGames: weeklyGames,
                    upcomingGames: upcomingGames,
                    recentGames: recentGames,
                    earlyGames: earlyGames,
                    horrorGames: horrorGames,
                    news: news
                });
                
            })
            .catch((error: string) => {
                popupS.modal({ content: `<div>• Error loading homepage. ${error}</div>` });
            });

    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    changeTimeGamesOption(timeGamesOption: TimeGamesOptions): void {
        this.setState({ timeGamesOption: timeGamesOption });
    }

    goToOption(): void {
        if (this.state.timeGamesOption === TimeGamesOptions.Upcoming) {
            this.props.history.push(`/search/steam/upcoming`);   
        } else if (this.state.timeGamesOption === TimeGamesOptions.Recent) {
            this.props.history.push(`/search/steam/recent`);   
        } else if (this.state.timeGamesOption === TimeGamesOptions.Early) {
            this.props.history.push(`/search/steam/earlyaccess`);   
        }
    }

    render() {
        return (
            <Home
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                bigGames={this.state.bigGames}
                bigGamesInfo={this.state.bigGamesInfo}
                featuredGames={this.state.featuredGames}
                featuredEditorsGamesIndicies={this.state.featuredEditorsGamesIndicies}
                featuredBigGamesIndicies={this.state.featuredBigGamesIndicies}
                news={this.state.news}
                goToRedirect={this.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                weeklyGames={this.state.weeklyGames}
                timeGamesOption={this.state.timeGamesOption}
                changeTimeGamesOption={this.changeTimeGamesOption}
                goToOption={this.goToOption}
                upcomingGames={this.state.upcomingGames}
                recentGames={this.state.recentGames}
                earlyGames={this.state.earlyGames}
                horrorGames={this.state.horrorGames}
            />
        );
    }

}

export default withRouter(HomeContainer);