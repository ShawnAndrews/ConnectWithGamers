const popupS = require('popups');
const loadImage = require('image-promise');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, GamesPresets, ExcludedGameIds, getIGDBImage, IGDBImageSizeEnums, IGDBImage } from '../../../../client-server-common/common';
import FullsizeResults from './FullsizeResults';

interface IFullsizeResultsContainerProps extends RouteComponentProps<any> {
    
}

interface IFullsizeResultsContainerState {
    isLoading: boolean;
    loadingMsg: string;
    resultsType: string;
    games: GameResponse[];
    retry: boolean;
    editorsGamesIndicies: number[];
    featureGamesIndicies: number[];
    subFeatureGamesIndicies: number[];
}

class FullsizeResultsContainer extends React.Component<IFullsizeResultsContainerProps, IFullsizeResultsContainerState> {

    constructor(props: IFullsizeResultsContainerProps) {
        super(props);
        this.loadGames = this.loadGames.bind(this);
        this.onRetryClick = this.onRetryClick.bind(this);

        this.loadGames(props);

        this.state = {
            isLoading: true,
            loadingMsg: "Loading games...",
            resultsType: props.match.params.type,
            games: undefined,
            retry: false,
            editorsGamesIndicies: [],
            featureGamesIndicies: [7,22],
            subFeatureGamesIndicies: [2,16,28,33]
        };
    }

    componentWillReceiveProps(newProps: IFullsizeResultsContainerProps): void {
        const newResultsType: string = newProps.match.params.type;

        if (this.state.resultsType !== newResultsType) {
            this.loadGames(newProps);

            this.setState({
                isLoading: true,
                resultsType: newResultsType
            });
        }
    }

    loadGames(someProps: IFullsizeResultsContainerProps): void {
        const type: string = someProps.match.params.type;
        let query: string = "";

        if (type === "popular") {
            query = GamesPresets.popular;
        } else if (type === "recent") {
            query = GamesPresets.recentlyReleased;
        } else if (type === "upcoming") {
            query = GamesPresets.upcoming;
        }

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${query}`)
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);

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
        .catch( (error: string) => {
            let retry: boolean = error === "Retry";
            if (!retry) {
                popupS.modal({ content: `<div>• ${error}</div>` });
            }
            this.setState({ isLoading: false, retry: retry});
        });

    }

    onRetryClick(): void {
        this.setState({ isLoading: true, retry: false }, () => {
            this.loadGames(this.props);
        });
    }

    render() {
        return (
            <FullsizeResults
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                games={this.state.games}
                retry={this.state.retry}
                onRetryClick={this.onRetryClick}
                editorsGamesIndicies={this.state.editorsGamesIndicies}
                featureGamesIndicies={this.state.featureGamesIndicies}
                subFeatureGamesIndicies={this.state.subFeatureGamesIndicies}
            />
        );
    }

}

export default withRouter(FullsizeResultsContainer);