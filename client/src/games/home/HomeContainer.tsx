const popupS = require('popups');
const loadImage = require('image-promise');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse, GamesPresets, ExcludedGameIds, GenericModelResponse } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';

export interface EditorsChoiceGameInfo {
    gameId: number;
    btnLink: string;
    btnText: string;
    game?: GameResponse;
}

interface IHomeContainerProps extends RouteComponentProps<any> { }

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    editorsChoiceGamesInfo: EditorsChoiceGameInfo[];
    editorsGamesIndicies: number[];
    featureGamesIndicies: number[];
    subFeatureGamesIndicies: number[];
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);

        this.state = {
            isLoading: true,
            loadingMsg: 'Loading games...',
            games: undefined,
            editorsChoiceGamesInfo: [
                { gameId: 22778, btnText: `Available March 26ᵗʰ`, btnLink: `https://store.steampowered.com/app/794260/Outward/` },
                { gameId: 27804, btnText: `Pre-order $39.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Fphoenix-point%2Fhome%3FpurchaseIntentId%3D75e9feab76fc46bb8ce6f3d7dadae3c8&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true` },
                { gameId: 113212, btnText: `Buy it now $29.99 USD`, btnLink: `https://accounts.epicgames.com/login?lang=en_US&redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fstore%2Fen-US%2Fproduct%2Foperencia%2Fhome%3FpurchaseIntentId%3D7d1d766667ef423bbd636ee6f054f755&client_id=875a3b57d3a640a6b7f9b4e883463ab4&noHostRedirect=true` },
                { gameId: 26166, btnText: `Coming soon`, btnLink: `https://www.epicgames.com/store/en-US/product/dauntless/home` },
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
                .filter((game: GameResponse) => game.screenshots);

            const editorsChoicePromises: Promise<GenericModelResponse>[] = [];
    
            this.state.editorsChoiceGamesInfo.forEach((x: EditorsChoiceGameInfo) => {
                editorsChoicePromises.push(IGDBService.httpGenericGetData<GenericModelResponse>(`/igdb/game/${x.gameId}`));
            });

            return Promise.all(editorsChoicePromises);
        })
        .then((gamesResponse: GenericModelResponse[]) => {

            gamesResponse.forEach((x: GenericModelResponse) => {
                const game: GameResponse = x.data;
                this.state.editorsChoiceGamesInfo.forEach((x: EditorsChoiceGameInfo) => {
                    if (game.id === x.gameId) {
                        x.game = game;
                    }
                });
            });

            this.setState({
                isLoading: false,
                games: games
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
                editorsChoiceGamesInfo={this.state.editorsChoiceGamesInfo}
                editorsGamesIndicies={this.state.editorsGamesIndicies}
                featureGamesIndicies={this.state.featureGamesIndicies}
                subFeatureGamesIndicies={this.state.subFeatureGamesIndicies}
            />
        );
    }

}

export default withRouter(HomeContainer);