const $ = require('jquery');
import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, CurrencyType } from '../../../../client-server-common/common';
import CoverGame from './CoverGame';
import { GlobalReduxState } from '../../../reducers/main';
import { getPriceInUserCurrency } from '../../../util/main';

interface ICoverGameContainerProps extends RouteComponentProps<any> {
    index: number;
    game: GameResponse;
    isEditorsChoiceGame: boolean;
    isBigGame: boolean;
}

interface ICoverGameContainerState {
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

type Props = ICoverGameContainerProps & ReduxStateProps & ReduxDispatchProps;

class CoverGameContainer extends React.Component<Props, ICoverGameContainerState> {

    constructor(props: Props) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
        this.onHoverGame = this.onHoverGame.bind(this);
        this.onHoverOutGame = this.onHoverOutGame.bind(this);
        this.nextScreenshotIndex = this.nextScreenshotIndex.bind(this);
        this.onVideoPreviewEnded = this.onVideoPreviewEnded.bind(this);
        this.getConvertedPrice = this.getConvertedPrice.bind(this);

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
        $(`.game-${this.props.index} .overlay`).stop().fadeIn("fast");
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
        this.props.history.push(`/search/game/${this.props.game.id}`);
    }

    onVideoPreviewEnded(): void {
        this.setState({
            videoPreviewEnded: this.props.game.screenshots && this.props.game.screenshots.length > 0 ? true : false
        });
    }

    getConvertedPrice(price: number): string {
        return getPriceInUserCurrency(price, this.props.currencyType, this.props.currencyRate);
    }

    render() {
        return (
            <CoverGame
                index={this.props.index}
                game={this.props.game}
                isEditorsChoiceGame={this.props.isEditorsChoiceGame}
                isBigGame={this.props.isBigGame}
                onHoverGame={this.onHoverGame}
                onHoverOutGame={this.onHoverOutGame}
                hoveredScreenshotIndex={this.state.hoveredScreenshotIndex}
                goToGame={this.goToGame}
                onVideoPreviewEnded={this.onVideoPreviewEnded}
                videoPreviewEnded={this.state.videoPreviewEnded}
                getConvertedPrice={this.getConvertedPrice}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: ICoverGameContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        currencyType: globalModalReduxState.topnav.currencyType,
        currencyRate: globalModalReduxState.topnav.currencyRate
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: ICoverGameContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, ICoverGameContainerProps>
    (mapStateToProps, mapDispatchToProps)(CoverGameContainer));