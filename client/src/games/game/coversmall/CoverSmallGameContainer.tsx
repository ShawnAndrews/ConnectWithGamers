const $ = require('jquery');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../../client-server-common/common';
import CoverSmallGame from './CoverSmallGame';

interface ICoverSmallGameContainerProps extends RouteComponentProps<any> {
    index: number;
    game: GameResponse;
}

interface ICoverSmallGameContainerState {
    hoveredTimeout: number;
    hoveredInterval: number;
    hoveredScreenshotIndex: number;
    videoPreviewEnded: boolean;
}

class CoverSmallGameContainer extends React.Component<ICoverSmallGameContainerProps, ICoverSmallGameContainerState> {

    constructor(props: ICoverSmallGameContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
        this.onHoverGame = this.onHoverGame.bind(this);
        this.onHoverOutGame = this.onHoverOutGame.bind(this);
        this.nextScreenshotIndex = this.nextScreenshotIndex.bind(this);
        this.onVideoPreviewEnded = this.onVideoPreviewEnded.bind(this);

        this.state = {
            hoveredTimeout: undefined,
            hoveredInterval: undefined,
            hoveredScreenshotIndex: 0,
            videoPreviewEnded: false
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
        $(`.search-game-${this.props.index} .overlay`).stop().fadeIn("fast");
        this.setState({
            hoveredTimeout: window.setTimeout(() => {
                this.setState({ 
                    hoveredInterval: window.setInterval(() => this.nextScreenshotIndex(), 1250) 
                });
            })
        });
    }

    onHoverOutGame(): void {
        $(`.search-game-${this.props.index} .overlay`).stop().fadeOut("fast");
        clearTimeout(this.state.hoveredTimeout);
        clearTimeout(this.state.hoveredInterval);
        this.setState({
            hoveredScreenshotIndex: 0
        });
    }

    goToGame(): void {
        this.props.history.push(`/search/game/${this.props.game.steamId}`);
    }

    onVideoPreviewEnded(): void {
        this.setState({
            videoPreviewEnded: this.props.game.screenshots && this.props.game.screenshots.length > 0 ? true : false
        });
    }

    render() {
        return (
            <CoverSmallGame
                index={this.props.index}
                game={this.props.game}
                onHoverGame={this.onHoverGame}
                onHoverOutGame={this.onHoverOutGame}
                hoveredScreenshotIndex={this.state.hoveredScreenshotIndex}
                goToGame={this.goToGame}
                onVideoPreviewEnded={this.onVideoPreviewEnded}
                videoPreviewEnded={this.state.videoPreviewEnded}
            />
        );
    }

}

export default withRouter(CoverSmallGameContainer);