const popupS = require('popups');
const loadImage = require('image-promise');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse, GamesPresets, IGDBImage, IGDBImageSizeEnums, getIGDBImage, ExcludedGameIds } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';

interface IHomeContainerProps extends RouteComponentProps<any> { }

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
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
            editorsGamesIndicies: [0],
            featureGamesIndicies: [0,42],
            subFeatureGamesIndicies: [10,17,28,33]
        };

    }

    componentDidMount(): void {

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.highlighted}`)
        .then((gamesResponse: MultiGameResponse) => {
            const games: GameResponse[] = gamesResponse.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);

            games.forEach((game: GameResponse, index: number) => {
                game.screenshots.forEach((screenshot: IGDBImage) => {
                    if (this.state.editorsGamesIndicies.findIndex((x: number) => x === index) !== -1) {
                        screenshot.url = getIGDBImage(screenshot.image_id, IGDBImageSizeEnums.screenshot_big);
                    } else if (this.state.featureGamesIndicies.findIndex((x: number) => x === index) !== -1) {
                        screenshot.url = getIGDBImage(screenshot.image_id, IGDBImageSizeEnums.screenshot_big);
                    } else if (this.state.subFeatureGamesIndicies.findIndex((x: number) => x === index) !== -1) {
                        screenshot.url = getIGDBImage(screenshot.image_id, IGDBImageSizeEnums.screenshot_med);
                    } else {
                        screenshot.url = getIGDBImage(screenshot.image_id, IGDBImageSizeEnums.screenshot_med);
                    }
                })
            });

            this.setState({
                loadingMsg: 'Loading images...',
                games: games
            }, () => {
                const allScreenshots: string[] = [].concat(...this.state.games.map((x: GameResponse) => x.screenshots));

                loadImage(allScreenshots)
                .then(() => {
                    this.setState({ isLoading: false });
                })
                .catch((error: Object) => {
                    this.setState({ isLoading: false });
                });
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• Error loading homepage games.</div>` });
        });

    }

    render() {
        return (
            <Home
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                games={this.state.games}
                editorsGamesIndicies={this.state.editorsGamesIndicies}
                featureGamesIndicies={this.state.featureGamesIndicies}
                subFeatureGamesIndicies={this.state.subFeatureGamesIndicies}
            />
        );
    }

}

export default withRouter(HomeContainer);