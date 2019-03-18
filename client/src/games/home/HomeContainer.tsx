const popupS = require('popups');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse, GamesPresets, ExcludedGameIds, GenericModelResponse, NewsArticle, MultiNewsResponse } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';

export interface BigGameInfo {
    gameId: number;
    btnLink: string;
    btnText: string;
    vidLink: string;
    game?: GameResponse;
}

interface IHomeContainerProps extends RouteComponentProps<any> { }

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    bigGamesInfo: BigGameInfo[];
    editorsGamesIndicies: number[];
    featureGamesIndicies: number[];
    subFeatureGamesIndicies: number[];
    news: NewsArticle[];
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);

        this.state = {
            isLoading: true,
            loadingMsg: 'Loading games...',
            games: undefined,
            news: undefined,
            bigGamesInfo: [
                { gameId: 22778, btnText: `Available March 26ᵗʰ`, btnLink: `https://store.steampowered.com/app/794260/Outward/`, vidLink: `https://cdn2.unrealengine.com/Diesel%2Fproduct%2Fviola%2Fhome%2FOutward_Epic-GamePageClip-12da38d3a4e0874b793c49221b50f7b2ea276eed.mp4` },
                { gameId: 27804, btnText: `Pre-order $39.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Fphoenix-point%2Fhome%3FpurchaseIntentId%3D75e9feab76fc46bb8ce6f3d7dadae3c8&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true`, vidLink: `https://cdn2.unrealengine.com/Diesel%2Fproduct%2Firis%2Fhome%2FGame-page-promo-video-3e9eec32c5858e036e623c294d6595d535e124ca.mp4` },
                { gameId: 113212, btnText: `Buy it now $29.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Foperencia%2Fhome%3FpurchaseIntentId%3D7d1d766667ef423bbd636ee6f054f755&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true`, vidLink: `https://cdn2.unrealengine.com/Diesel%2Fproduct%2Flily%2Fhome%2FOperencia_Epic_Store_Preview-81f84d330547739e0cd61ff3dc8f1ff8ce555f9c.mp4` },
                { gameId: 26166, btnText: `Coming soon`, btnLink: `https://www.epicgames.com/store/en-US/product/dauntless/home`, vidLink: `https://cdn2.unrealengine.com/Diesel%2Fproduct%2Fdauntless%2Fhome%2FEGs_Dauntless_P1-41901f8bb92a2083263c4ba964d48732e93f9d92.mp4` },
            ],
            editorsGamesIndicies: [],
            featureGamesIndicies: [41],
            subFeatureGamesIndicies: [4,14,28,33]
        };

    }

    componentDidMount(): void {
        let games: GameResponse[] = undefined;

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.highlighted}`)
        .then((gamesResponse: MultiGameResponse) => {
            games = gamesResponse.data
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

            return IGDBService.httpGenericGetData<MultiNewsResponse>(`/igdb/games/news`);
        })
        .then( (response: MultiNewsResponse) => {
            const news: NewsArticle[] = response.data.slice(0, 12);

            this.setState({
                isLoading: false,
                games: games,
                news: news
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• Error loading homepage games. ${error}</div>` });
        });

    }

    render() {
        return (
            <Home
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                games={this.state.games}
                bigGamesInfo={this.state.bigGamesInfo}
                editorsGamesIndicies={this.state.editorsGamesIndicies}
                featureGamesIndicies={this.state.featureGamesIndicies}
                subFeatureGamesIndicies={this.state.subFeatureGamesIndicies}
                news={this.state.news}
            />
        );
    }

}

export default withRouter(HomeContainer);