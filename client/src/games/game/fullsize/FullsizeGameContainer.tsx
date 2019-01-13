const $ = require('jquery');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, steamAppUrl } from '../../../../client-server-common/common';
import FullsizeGame from './FullsizeGame';

interface IFullsizeGameContainerProps extends RouteComponentProps<any> {
    index: number;
    game: GameResponse;
    isEditorsChoiceGame: boolean;
    isFeatureGame: boolean;
    isSubFeatureGame: boolean;
} 

interface IFullsizeGameContainerState {
    hoveredTimeout: number;
    hoveredInterval: number;
    hoveredScreenshotIndex: number;
}

class FullsizeGameContainer extends React.Component<IFullsizeGameContainerProps, IFullsizeGameContainerState> {

    constructor(props: IFullsizeGameContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
        this.goToSteamPage = this.goToSteamPage.bind(this);
        this.onHoverGame = this.onHoverGame.bind(this);
        this.onHoverOutGame = this.onHoverOutGame.bind(this);
        this.nextScreenshotIndex = this.nextScreenshotIndex.bind(this);

        this.state = {
            hoveredTimeout: undefined,
            hoveredInterval: undefined,
            hoveredScreenshotIndex: 0
        };
    }

    nextScreenshotIndex(): void {
        let nextScreenshotIndex: number = this.state.hoveredScreenshotIndex + 1;
        if (nextScreenshotIndex === this.props.game.screenshots.length) {
            nextScreenshotIndex = 0;
        }
        this.setState({ hoveredScreenshotIndex: nextScreenshotIndex });
    }

    onHoverGame(): void {
        $(`.game-${this.props.index} .overlay`).fadeIn("fast");
        this.setState({
            hoveredTimeout: window.setTimeout(() => {
                this.setState({ 
                    hoveredInterval: window.setInterval(() => this.nextScreenshotIndex(), 1250) 
                });
            })
        });
    }

    onHoverOutGame(): void {
        $(`.game-${this.props.index} .overlay`).stop().fadeOut("fast");
        clearTimeout(this.state.hoveredTimeout);
        clearTimeout(this.state.hoveredInterval);
        this.setState({
            hoveredScreenshotIndex: 0
        });
    }

    goToGame(): void {
        this.props.history.push(`/games/search/game/${this.props.game.id}`);
    }

    goToSteamPage(): void {
        this.props.history.push(`${steamAppUrl}/${this.props.game.steamid}`);
    }

    render() {
        return (
            <FullsizeGame
                index={this.props.index}
                game={this.props.game}
                isEditorsChoiceGame={this.props.isEditorsChoiceGame}
                isFeatureGame={this.props.isFeatureGame}
                isSubFeatureGame={this.props.isSubFeatureGame}
                onHoverGame={this.onHoverGame}
                onHoverOutGame={this.onHoverOutGame}
                hoveredScreenshotIndex={this.state.hoveredScreenshotIndex}
                goToGame={this.goToGame}
                goToSteamPage={this.goToSteamPage}
            />
        );
    }

}

export default withRouter(FullsizeGameContainer);