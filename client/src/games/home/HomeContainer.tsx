const popupS = require('popups');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse, ExcludedGameIds, GenericModelResponse, NewsArticle, MultiNewsResponse, SidenavEnums } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';

export interface BigGameInfo {
    gameId: number;
    btnLink: string;
    btnText: string;
    game?: GameResponse;
}

interface IHomeContainerProps extends RouteComponentProps<any> {
    sidebarActiveEnum: SidenavEnums;
}

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    bigGamesInfo: BigGameInfo[];
    featuredGames: GameResponse[];
    featuredEditorsGamesIndicies: number[];
    featuredBigGamesIndicies: number[];
    news: NewsArticle[];
    weeklyGames: GameResponse[];
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);

        this.state = {
            isLoading: true,
            loadingMsg: 'Loading games...',
            featuredGames: undefined,
            weeklyGames: undefined,
            news: undefined,
            bigGamesInfo: [
                { gameId: 22778, btnText: `Available March 26ᵗʰ`, btnLink: `https://store.steampowered.com/app/794260/Outward/` },
                { gameId: 27804, btnText: `Pre-order $39.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Fphoenix-point%2Fhome%3FpurchaseIntentId%3D75e9feab76fc46bb8ce6f3d7dadae3c8&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true` },
                { gameId: 113212, btnText: `Buy it now $29.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Foperencia%2Fhome%3FpurchaseIntentId%3D7d1d766667ef423bbd636ee6f054f755&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true` },
                { gameId: 26166, btnText: `Coming soon`, btnLink: `https://www.epicgames.com/store/en-US/product/dauntless/home`},
            ],
            featuredEditorsGamesIndicies: [4],
            featuredBigGamesIndicies: [4]
        };

    }

    componentDidMount(): void {
        let featuredGames: GameResponse[] = undefined;
        let weeklyGames: GameResponse[] = undefined;

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/popular`)
        .then((gamesResponse: MultiGameResponse) => {
            featuredGames = gamesResponse.data
                .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                .filter((game: GameResponse) => game.screenshots)
                .slice(0, 9);

            const editorsChoicePromises: Promise<GenericModelResponse>[] = [];
    
            this.state.bigGamesInfo.forEach((x: BigGameInfo) => {
                editorsChoicePromises.push(IGDBService.httpGenericGetData<GenericModelResponse>(`/igdb/game/${x.gameId}`));
            });

            return Promise.all(editorsChoicePromises);
        })
        .then((gamesResponse: GenericModelResponse[]) => {

            gamesResponse.forEach((x: GenericModelResponse) => {
                const game: GameResponse = x.data;
                this.state.bigGamesInfo.forEach((x: BigGameInfo) => {
                    if (game.id === x.gameId) {
                        x.game = game;
                    }
                });
            });

            return IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/steam/weeklydeals`);
        })
        .then((gamesResponse: MultiGameResponse) => {
            weeklyGames = gamesResponse.data
            .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
            .filter((game: GameResponse) => game.screenshots);

            return IGDBService.httpGenericGetData<MultiNewsResponse>(`/igdb/games/news`);
        })
        .then( (response: MultiNewsResponse) => {
            const news: NewsArticle[] = response.data;

            this.setState({
                isLoading: false,
                featuredGames: featuredGames,
                weeklyGames: weeklyGames,
                news: news
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• Error loading homepage games. ${error}</div>` });
        });

    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    render() {
        return (
            <Home
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                bigGamesInfo={this.state.bigGamesInfo}
                featuredGames={this.state.featuredGames}
                featuredEditorsGamesIndicies={this.state.featuredEditorsGamesIndicies}
                featuredBigGamesIndicies={this.state.featuredBigGamesIndicies}
                news={this.state.news}
                goToRedirect={this.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                weeklyGames={this.state.weeklyGames}
            />
        );
    }

}

export default withRouter(HomeContainer);