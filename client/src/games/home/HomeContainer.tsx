const popupS = require('popups');
const $ = require('jquery');
const loadImage = require('image-promise');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';

interface IHomeContainerProps extends RouteComponentProps<any> { }

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    hoveredIndex: number;
    hoveredTimeout: number;
    hoveredInterval: number;
    hoveredScreenshotIndex: number;
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);
        this.onHoverGame = this.onHoverGame.bind(this);
        this.onHoverOutGame = this.onHoverOutGame.bind(this);
        this.nextScreenshotIndex = this.nextScreenshotIndex.bind(this);

        this.state = {
            isLoading: true,
            loadingMsg: 'Loading homepage...',
            hoveredIndex: -1,
            hoveredTimeout: undefined,
            hoveredInterval: undefined,
            hoveredScreenshotIndex: 0,
            games: undefined,
        };

    }

    componentDidMount(): void {

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/highlighted`)
        .then((gamesResponse: MultiGameResponse) => {
            this.setState({
                loadingMsg: 'Loading images...',
                games: gamesResponse.data.reverse()
            }, () => {
                const allHomepageScreenshots: string[] = [].concat(...this.state.games.map((x: GameResponse) => x.screenshots));

                loadImage(allHomepageScreenshots)
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

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    nextScreenshotIndex(index: number): void {
        let nextScreenshotIndex: number = this.state.hoveredScreenshotIndex + 1;
        if (nextScreenshotIndex === this.state.games[index].screenshots.length) {
            nextScreenshotIndex = 0;
        }
        this.setState({ hoveredScreenshotIndex: nextScreenshotIndex });
    }

    onHoverGame(index: number): void {
        $(`.game-${index} .overlay`).fadeIn("fast");
        this.setState({
            hoveredIndex: index,
            hoveredTimeout: window.setTimeout(() => {
                this.setState({ hoveredInterval: window.setInterval(() => this.nextScreenshotIndex(index), 1500) });
            })
        });
    }

    onHoverOutGame(index: number): void {
        $(`.game-${index} .overlay`).stop().fadeOut("fast");
        clearTimeout(this.state.hoveredTimeout);
        clearTimeout(this.state.hoveredInterval);
        this.setState({
            hoveredIndex: -1,
            hoveredScreenshotIndex: 0
        });
    }

    render() {
        return (
            <Home
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                games={this.state.games}
                hoveredIndex={this.state.hoveredIndex}
                goToRedirect={this.goToRedirect}
                onHoverGame={this.onHoverGame}
                onHoverOutGame={this.onHoverOutGame}
                hoveredScreenshotIndex={this.state.hoveredScreenshotIndex}
            />
        );
    }

}

export default withRouter(HomeContainer);