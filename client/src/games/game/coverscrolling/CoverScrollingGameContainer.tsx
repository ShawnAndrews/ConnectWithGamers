const $ = require('jquery');
import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, CurrencyType } from '../../../../client-server-common/common';
import CoverScrollingGame from './CoverScrollingGame';
import { GlobalReduxState } from '../../../reducers/main';

interface ICoverScrollingGameContainerProps extends RouteComponentProps<any> {
    index: number;
    game: GameResponse;
}

interface ICoverScrollingGameContainerState {
    hoveredTimeout: number;
    hoveredInterval: number;
    hoveredScreenshotIndex: number;
    videoPreviewEnded: boolean;
}

interface ReduxStateProps {
    currencyType: CurrencyType;
    currencyRate: number;
}

interface ReduxDispatchProps {

}

type Props = ICoverScrollingGameContainerProps & ReduxStateProps & ReduxDispatchProps;

class CoverScrollingGameContainer extends React.Component<Props, ICoverScrollingGameContainerState> {

    constructor(props: Props) {
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
        $(`.cover-scrolling-game-${this.props.index} .overlay`).stop().fadeIn("fast");
        this.setState({
            hoveredTimeout: window.setTimeout(() => {
                this.setState({ 
                    hoveredInterval: window.setInterval(() => this.nextScreenshotIndex(), 1250) 
                });
            })
        });
    }

    onHoverOutGame(): void {
        $(`.cover-scrolling-game-${this.props.index} .overlay`).stop().fadeOut("fast");
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
            <CoverScrollingGame
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

const mapStateToProps = (state: any, ownProps: ICoverScrollingGameContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        currencyType: globalModalReduxState.topnav.currencyType,
        currencyRate: globalModalReduxState.topnav.currencyRate
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ICoverScrollingGameContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ICoverScrollingGameContainerProps>
    (mapStateToProps, mapDispatchToProps)(CoverScrollingGameContainer));