const popupS = require('popups');
import * as React from 'react';
import Home from './Home';
import * as SteamService from '../../service/steam/main';
import { MultiGameResponse, GameResponse, ExcludedGameIds, GenericModelResponse, NewsArticle, SidenavEnums, CurrencyType } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';
import { getGameBestPricingStatus } from '../../util/main';
import * as Redux from 'redux';
import { GlobalReduxState } from '../../reducers/main';
import { connect } from 'react-redux';

export enum TimeGamesOptions {
    Upcoming,
    Recent,
    Early
}

interface IHomeContainerProps extends RouteComponentProps<any> {
    sidebarActiveEnum: SidenavEnums;
}

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    bigGameSteamIds: number[];
    bigGames: GameResponse[];
    featuredGames: GameResponse[];
    news: NewsArticle[];
    weeklyGames: GameResponse[];
    timeGamesOption: TimeGamesOptions;
    upcomingGames: GameResponse[];
    recentGames: GameResponse[];
    earlyGames: GameResponse[];
    horrorGames: GameResponse[];
    endingSoonGames: GameResponse[];
}

interface ReduxStateProps {
    currencyType: CurrencyType;
    currencyRate: number;
}

interface ReduxDispatchProps {

}

type Props = IHomeContainerProps & ReduxStateProps & ReduxDispatchProps;

class HomeContainer extends React.Component<Props, IHomeContainerState> {

    constructor(props: Props) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);
        this.changeTimeGamesOption = this.changeTimeGamesOption.bind(this);
        this.goToOption = this.goToOption.bind(this);

        this.state = {
            isLoading: true,
            loadingMsg: 'Loading games...',
            bigGameSteamIds: [648800, 848450, 361420, 275850],
            bigGames: undefined,
            featuredGames: undefined,
            weeklyGames: undefined,
            upcomingGames: undefined,
            recentGames: undefined,
            earlyGames: undefined,
            horrorGames: undefined,
            news: undefined,
            timeGamesOption: TimeGamesOptions.Upcoming,
            endingSoonGames: undefined
        };

    }

    componentDidMount(): void {
        let promises: Promise<any>[] = [];

        promises.push(SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/popular`));
        this.state.bigGameSteamIds.forEach((steamId: number) => {
            promises.push(SteamService.httpGenericGetData<GenericModelResponse>(`/api/steam/game/${steamId}`));
        });
        promises.push(SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/weeklydeals`));
        promises.push(SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/upcoming`));
        promises.push(SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/recent`));
        promises.push(SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/earlyaccess`));
        promises.push(SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/horror`));
        promises.push(SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/endingsoon`));

        Promise.all(promises)
            .then((data: any[]) => {
                const featuredGamesData: MultiGameResponse = data[0];
                const featuredGames: GameResponse[] = featuredGamesData.data
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1)
                    .filter((game: GameResponse) => game.cover)
                    .sort((a: GameResponse, b: GameResponse) => b.review.id - a.review.id)
                    .slice(0, 10);
                const bigGamesData: GenericModelResponse[] = data.slice(1, 1 + this.state.bigGameSteamIds.length);
                const bigGames: GameResponse[] = [];
                bigGamesData.forEach((x: GenericModelResponse) => {
                    const game: GameResponse = x.data;
                    this.state.bigGameSteamIds.forEach((steamId: number) => {
                        if (game.steamId === steamId) {
                            bigGames.push(x.data);
                        }
                    });
                });
                const weeklyGamesData: MultiGameResponse = data[1 + this.state.bigGameSteamIds.length];
                const weeklyGames: GameResponse[] = weeklyGamesData.data
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1)
                    .filter((game: GameResponse) => game.cover);
                const upcomingGamesData: MultiGameResponse = data[2 + this.state.bigGameSteamIds.length];
                const upcomingGames: GameResponse[] = upcomingGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1)
                    .filter((game: GameResponse) => new Date(game.first_release_date) > new Date())
                    .slice(0, 20);
                const recentGamesData: MultiGameResponse = data[3 + this.state.bigGameSteamIds.length];
                const recentGames: GameResponse[] = recentGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1)
                    .sort((a: GameResponse, b: GameResponse) => new Date(b.first_release_date).getTime() - new Date(a.first_release_date).getTime())
                    .slice(0, 20);
                const earlyGamesData: MultiGameResponse = data[4 + this.state.bigGameSteamIds.length];
                const earlyGames: GameResponse[] = earlyGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1)
                    .filter((game: GameResponse) => new Date(game.first_release_date) > new Date())
                    .sort((a: GameResponse, b: GameResponse) => new Date(a.first_release_date).getTime() - new Date(b.first_release_date).getTime())
                    .slice(0, 20);
                const horrorGamesData: MultiGameResponse = data[5 + this.state.bigGameSteamIds.length];
                const horrorGames: GameResponse[] = horrorGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1)
                    .sort((a: GameResponse, b: GameResponse) => {
                        const bestPriceDiscountPercentA: number = getGameBestPricingStatus(a.pricings).discount_percent || 0;
                        const bestPriceDiscountPercentB: number = getGameBestPricingStatus(b.pricings).discount_percent || 0;
                        return bestPriceDiscountPercentB - bestPriceDiscountPercentA;
                    })
                    .slice(0, 4);
                const endingSoonGamesData: MultiGameResponse = data[6 + this.state.bigGameSteamIds.length];
                const endingSoonGames: GameResponse[] = endingSoonGamesData.data
                    .filter((game: GameResponse) => game.cover)
                    .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1)
                    .slice(0, 9);

                this.setState({
                    isLoading: false,
                    bigGames: bigGames,
                    featuredGames: featuredGames,
                    weeklyGames: weeklyGames,
                    upcomingGames: upcomingGames,
                    recentGames: recentGames,
                    earlyGames: earlyGames,
                    horrorGames: horrorGames,
                    endingSoonGames: endingSoonGames
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
                games={this.state.bigGames}
                featuredGames={this.state.featuredGames}
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
                endingSoonGames={this.state.endingSoonGames}
                currencyRate={this.props.currencyRate}
                currencyType={this.props.currencyType}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IHomeContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        currencyType: globalModalReduxState.topnav.currencyType,
        currencyRate: globalModalReduxState.topnav.currencyRate
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IHomeContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IHomeContainerProps>
    (mapStateToProps, mapDispatchToProps)(HomeContainer));