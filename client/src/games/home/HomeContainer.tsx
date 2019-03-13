const popupS = require('popups');
const loadImage = require('image-promise');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse, GamesPresets, IGDBImage, IGDBImageSizeEnums, getIGDBImage, ExcludedGameIds, GenericModelResponse } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';

interface IHomeContainerProps extends RouteComponentProps<any> { }

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    bigGame: GameResponse;
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
            bigGame: undefined,
            editorsGamesIndicies: [0],
            featureGamesIndicies: [41],
            subFeatureGamesIndicies: [4,14,28,33]
        };

    }

    componentDidMount(): void {
        let games: GameResponse[] = undefined;
        let bigGame: GameResponse = undefined;

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.highlighted}`)
        .then((gamesResponse: MultiGameResponse) => {
            games = gamesResponse.data
                .filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1)
                .filter((game: GameResponse) => game.screenshots);

            return IGDBService.httpGenericGetData<GenericModelResponse>(`/igdb/game/22778`);
        })
        .then((gamesResponse: GenericModelResponse) => {
            bigGame = gamesResponse.data;

            this.setState({
                isLoading: false,
                games: games,
                bigGame: bigGame
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
                bigGame={this.state.bigGame}
                editorsGamesIndicies={this.state.editorsGamesIndicies}
                featureGamesIndicies={this.state.featureGamesIndicies}
                subFeatureGamesIndicies={this.state.subFeatureGamesIndicies}
            />
        );
    }

}

export default withRouter(HomeContainer);