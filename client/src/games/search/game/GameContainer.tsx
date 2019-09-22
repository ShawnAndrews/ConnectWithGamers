const popupS = require('popups');
import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Game from './Game';
import { SingleGameResponse, GameResponse, CurrencyType } from '../../../../../client/client-server-common/common';
import { loggedIn } from '../../../service/account/main';
import { GlobalReduxState } from '../../../reducers/main';
import { getPriceInUserCurrency } from '../../../util/main';

interface IGameContainerProps extends RouteComponentProps<any> { }

interface IGameContainerState {
    isLoading: boolean;
    game: GameResponse;
    summaryExpanded: boolean;
    genre_ids: number[];
    gameid: number;
    gameRatedSnackbarOpen: boolean;
    mediaCarouselElement: any;
    mouseDragged: boolean;
    mouseClicked: boolean;
    notifcationsEnabled: boolean;
    hoveredSimilarGameIndex: number;
}

interface ReduxStateProps {
    currencyType: CurrencyType;
    currencyRate: number;
}

interface ReduxDispatchProps {

}

type Props = IGameContainerProps & ReduxStateProps & ReduxDispatchProps;

class GameContainer extends React.PureComponent<Props, IGameContainerState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            game: undefined,
            summaryExpanded: undefined,
            genre_ids: undefined,
            gameid: props.match.params.id,
            gameRatedSnackbarOpen: false,
            mediaCarouselElement: undefined,
            mouseDragged: false,
            mouseClicked: false,
            notifcationsEnabled: false,
            hoveredSimilarGameIndex: undefined
        };
        this.loadGame = this.loadGame.bind(this);
        this.handleSteamClick = this.handleSteamClick.bind(this);
        this.handlePlatformClick = this.handlePlatformClick.bind(this);
        this.handleGenreClick = this.handleGenreClick.bind(this);
        this.expandSummary = this.expandSummary.bind(this);
        this.onRateStarsClick = this.onRateStarsClick.bind(this);
        this.gameRatedSnackbarClose = this.gameRatedSnackbarClose.bind(this);
        this.goToGame = this.goToGame.bind(this);
        this.onSimilarGamesMouseMove = this.onSimilarGamesMouseMove.bind(this);
        this.onSimilarGamesMouseDown = this.onSimilarGamesMouseDown.bind(this);
        this.onSimilarGamesMouseUp = this.onSimilarGamesMouseUp.bind(this);
        this.onSimilarGamesMouseOver = this.onSimilarGamesMouseOver.bind(this);
        this.onSimilarGamesMouseLeave = this.onSimilarGamesMouseLeave.bind(this);
        this.onNotificationsClick = this.onNotificationsClick.bind(this);
        this.onPricingClick = this.onPricingClick.bind(this);
        this.getConvertedPrice = this.getConvertedPrice.bind(this);
    }

    componentWillMount(): void {
        // load game
        if (this.props.match.params.id) {
            this.setState({ isLoading: true }, () => {
                this.loadGame(this.props.match.params.id);
            });
        }
    }

    componentWillReceiveProps(newProps: IGameContainerProps) {
        // load new game
        if (newProps.match.params.id && this.state.gameid !== newProps.match.params.id) {
            this.setState({ isLoading: true }, () => {
                this.loadGame(newProps.match.params.id);
            });
        }
    }

    loadGame(id: number): void {
        SteamService.httpGenericGetData<SingleGameResponse>(`/steam/game/${id}`)
            .then( (gameResponse: SingleGameResponse) => {
                const game: GameResponse = gameResponse.data;

                this.setState({ isLoading: false, game: game, gameid: id });
            })
            .catch( (error: string) => {
                this.setState({ isLoading: false, game: undefined });
            });
    }

    handleSteamClick(url: string): void {
        window.open(url);
    }

    handlePlatformClick(index: number): void {
        // this.props.history.push(`/search/filter/?platforms=${this.state.game.platforms[index]}`);
    }
    
    handleGenreClick(index: number): void {
        this.props.history.push(`/search/filter/?genres=${this.state.game.genres[index]}`);
    }

    expandSummary(): void {
        this.setState({ summaryExpanded: true });
    }

    onRateStarsClick(rating: number): void {
        
        if (loggedIn()) {

            SteamService.httpGenericGetData<void>(`/account/game/rate/?id=${this.state.gameid}&rating=${rating}`)
            .then( (response: void) => {
                this.setState({
                    gameRatedSnackbarOpen: true
                });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
            });

        } else {
            popupS.modal({ content: `Login to rate games.` });
        }
    }

    gameRatedSnackbarClose(): void {
        this.setState({
            gameRatedSnackbarOpen: false
        });
    }

    onNotificationsClick(): void {
        this.setState({
            notifcationsEnabled: !this.state.notifcationsEnabled
        });
    }

    goToGame(id: number): void {
        if (!this.state.mouseDragged) {
            console.log(`going to ${`/search/game/${id}`}`);
            this.props.history.push(`/search/game/${id}`);
        }
    }

    onSimilarGamesMouseMove(event: React.MouseEvent<HTMLDivElement>): void {
        if (this.state.mouseClicked) {
            this.setState({
                mouseDragged: true
            });
        }
    };

    onSimilarGamesMouseDown(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({
            mouseClicked: true
        });
    };

    onSimilarGamesMouseUp(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({
            mouseClicked: false
        });
        setTimeout(() => 
            this.setState({
                mouseDragged: false
            }), 50);
    };

    onSimilarGamesMouseOver(index: number): void {
        this.setState({
            hoveredSimilarGameIndex: index
        });
    };

    onSimilarGamesMouseLeave(): void {
        this.setState({
            hoveredSimilarGameIndex: undefined
        });
    };

    onPricingClick(): void {
        const link: string = ""// steam link -> this.state.game.steam_link;

        window.open(link, "_blank");
    }

    getConvertedPrice(price: number, skipCurrencyType: boolean): string {
        return getPriceInUserCurrency(price, this.props.currencyType, this.props.currencyRate, skipCurrencyType);
    }

    render() {
        return (
            <Game
                isLoading={this.state.isLoading}
                gameId={this.state.gameid}
                game={this.state.game}
                summaryExpanded={this.state.summaryExpanded}
                gameRatedSnackbarOpen={this.state.gameRatedSnackbarOpen}
                notifcationsEnabled={this.state.notifcationsEnabled}
                handleSteamClick={this.handleSteamClick}
                handlePlatformClick={this.handlePlatformClick}
                handleGenreClick={this.handleGenreClick}
                expandSummary={this.expandSummary}
                onRateStarsClick={this.onRateStarsClick}
                gameRatedSnackbarClose={this.gameRatedSnackbarClose}
                mediaCarouselElement={this.state.mediaCarouselElement}
                goToGame={this.goToGame}
                onSimilarGamesMouseDown={this.onSimilarGamesMouseDown}
                onSimilarGamesMouseUp={this.onSimilarGamesMouseUp}
                onSimilarGamesMouseMove={this.onSimilarGamesMouseMove}
                onSimilarGamesMouseOver={this.onSimilarGamesMouseOver}
                onSimilarGamesMouseLeave={this.onSimilarGamesMouseLeave}
                onNotificationsClick={this.onNotificationsClick}
                onPricingClick={this.onPricingClick}
                hoveredSimilarGameIndex={this.state.hoveredSimilarGameIndex}
                getConvertedPrice={this.getConvertedPrice}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IGameContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        currencyType: globalModalReduxState.topnav.currencyType,
        currencyRate: globalModalReduxState.topnav.currencyRate
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IGameContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IGameContainerProps>
    (mapStateToProps, mapDispatchToProps)(GameContainer));