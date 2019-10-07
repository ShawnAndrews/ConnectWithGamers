const popupS = require('popups');
// const Chart = require('chart.js');
import * as Chart from 'chart.js';
import * as Redux from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Game from './Game';
import { SingleGameResponse, GameResponse, CurrencyType, Review, GameReviewsResponse, MultiGameResponse, PriceInfoResponse, PricingsEnum } from '../../../../../client/client-server-common/common';
import { loggedIn } from '../../../service/account/main';
import { GlobalReduxState } from '../../../reducers/main';
import { getPriceInUserCurrency, getFormattedDate, getUniquePricings } from '../../../util/main';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
    containerValue: number;
    reviews: Review[];
    reviewsCollapsed: boolean[];
    similar_games: GameResponse[];
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
            hoveredSimilarGameIndex: undefined,
            containerValue: 0,
            reviews: undefined,
            reviewsCollapsed: undefined,
            similar_games: undefined
        };
        this.loadGame = this.loadGame.bind(this);
        this.handleSteamClick = this.handleSteamClick.bind(this);
        this.handlePlatformClick = this.handlePlatformClick.bind(this);
        this.handleGenreClick = this.handleGenreClick.bind(this);
        this.handleFeaturesClick = this.handleFeaturesClick.bind(this);
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
        this.handleContainerChange = this.handleContainerChange.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.handleReviewClick = this.handleReviewClick.bind(this);
        this.loadSimilarGames = this.loadSimilarGames.bind(this);
        this.loadPricingHistory = this.loadPricingHistory.bind(this);
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
        SteamService.httpGenericGetData<SingleGameResponse>(`/api/steam/game/${id}`)
            .then( (gameResponse: SingleGameResponse) => {
                const game: GameResponse = gameResponse.data;

                this.setState({ isLoading: false, game: game, gameid: id, reviews: undefined, reviewsCollapsed: undefined, containerValue: 0, similar_games: undefined });
            })
            .catch( (error: string) => {
                this.setState({ isLoading: false, game: undefined });
            });
    }

    loadPricingHistory(): void {
        let bindedFunc = (chartNum: number, chartTitle: string, x: number[], y: number[], currencyType: any, currencyRate: any, maxAmount: number): void => {
            const callback: any = (value, index, values): string => { ; return '$' + value; };

            Chart.defaults.global.defaultFontColor = 'white';
            var canvas: any = document.getElementById(`lineChart${chartNum}`);
            var ctx = canvas.getContext("2d");
            var gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(56, 202, 235,0.2)');   
            gradient.addColorStop(1, 'rgba(56, 202, 235,0.2)');
            const data: Chart.ChartData = {
                datasets: [
                    {
                        showLine: true,
                        datalabels: {
                            display: true,
                            align: 'end',
                            offset: 10,
                            formatter: function (value) {
                                return getPriceInUserCurrency(value.y, currencyType, currencyRate);
                            }
                          },
                        label: chartTitle,
                        borderColor: "#38caeb",
                        backgroundColor: gradient,
                        pointBackgroundColor: "white",
                        pointBorderColor: "white",
                        pointHoverBackgroundColor: "white",
                        pointHoverBorderColor: "orange",
                        data: x.map((val: number, index: number) => { return { x: x[index], y: y[index] } })
                    }
                ]
            };
            const options: Chart.ChartOptions = {
                plugins: [ChartDataLabels],
                legend: {
                    display: false,
                    labels: {
                         fontColor: 'orange'
                        }
                    },
                title: {
                   display: true,
                   fontColor: '#38caeb',
                   text: chartTitle
                },
                tooltips: {
                    displayColors: false,
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            console.log(`Processing: ${JSON.stringify(tooltipItems)}`);
                            return `${getPriceInUserCurrency(parseFloat(tooltipItems.value), currencyType, currencyRate)} at ${getFormattedDate(new Date(tooltipItems.xLabel))}`;
                        }
                    }
               },
               scales: {
                yAxes: [{
                        gridLines: { color: "rgba(255,255,255,0.1)" },
                        ticks: {
                            callback: callback,
                            min: 0,
                            max: Math.round(maxAmount * 1.25).toFixed(2)
                        }
                   }],
                xAxes:  [{
                        gridLines: { color: "rgba(255,255,255,0.1)" },
                        ticks: {
                            callback: (value, index, values): string => { return getFormattedDate(value); }
                        }
               }],
               } 
            };
            var lineChart =  new Chart(ctx , {
                type: "scatter",
                data: data,
                options: options
            });
        };

        const uniquePricings: PriceInfoResponse[] = getUniquePricings(this.state.game.pricings);

        uniquePricings.forEach((uniquePricing: PriceInfoResponse, i: number) => {
            const titlePrefix: string = uniquePricing.pricingEnumSysKeyId === PricingsEnum.demo ? `Demo` : uniquePricing.pricingEnumSysKeyId === PricingsEnum.dlc ? `DLC` : uniquePricing.pricingEnumSysKeyId === PricingsEnum.bundles ? `Bundle` : `Main game`;
            const axisVals: Chart.Point[] = [];
            let maxAmount: number = 0;
            this.state.game.pricings.forEach((pricing: PriceInfoResponse) => {
                if (uniquePricing.steamGamesSysKeyId === pricing.steamGamesSysKeyId && uniquePricing.pricingEnumSysKeyId === pricing.pricingEnumSysKeyId && uniquePricing.title === pricing.title) {
                    if (pricing.price > maxAmount) {
                        maxAmount = pricing.price;
                    }
                    axisVals.push({ x: new Date(pricing.log_dt).getTime(), y: pricing.price})
                    axisVals.sort((a: Chart.Point, b: Chart.Point) => a.x - b.x);
                }
            });
            setTimeout(bindedFunc, 1000, i, uniquePricing.pricingEnumSysKeyId === PricingsEnum.main_game ? titlePrefix : `${titlePrefix} — ${uniquePricing.title}`, axisVals.map((x: Chart.Point) => x.x), axisVals.map((x: Chart.Point) => x.y), this.props.currencyType, this.props.currencyRate, maxAmount);
        });
        
    }

    loadReviews(): void {
        SteamService.httpGenericGetData<GameReviewsResponse>(`/api/steam/game/reviews/${this.state.game.steamId}`)
            .then( (reviews: GameReviewsResponse) => {
                const reviewsCollapsed = [];

                reviews.data.forEach(() => reviewsCollapsed.push(false));

                this.setState({ reviews: reviews.data, reviewsCollapsed: reviewsCollapsed });
            })
            .catch( (error: string) => {
                console.log(`Error loading steam reviews: ${error}`);
            });
    }

    loadSimilarGames(): void {
        SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/game/similar/${this.state.game.steamId}`)
            .then( (response: MultiGameResponse) => {
                this.setState({ similar_games: response.data });
            })
            .catch( (error: string) => {
                console.log(`Error loading steam reviews: ${error}`);
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

    handleFeaturesClick(index: number): void {
        this.props.history.push(`/search/filter/?game_modes=${this.state.game.genres[index]}`);
    }

    expandSummary(): void {
        this.setState({ summaryExpanded: true });
    }

    handleContainerChange(event: React.ChangeEvent<{}>, newValue: number): void {

        if (newValue === 1 && this.state.game.pricings && this.state.game.pricings.length > 0) {
            this.loadPricingHistory();
        } else if (newValue === 3 && !this.state.similar_games) {
            this.loadSimilarGames();
        } else if (newValue === 4 && !this.state.reviews) {
            this.loadReviews();
        }
        
        this.setState({ containerValue: newValue });
    }

    handleReviewClick(index: number): void {
        const updatedReviewsCollapsed: boolean[] = Object.assign([], this.state.reviewsCollapsed);
        updatedReviewsCollapsed[index] = !this.state.reviewsCollapsed[index];
        this.setState({ reviewsCollapsed: updatedReviewsCollapsed });
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
                handleFeaturesClick={this.handleFeaturesClick}
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
                containerValue={this.state.containerValue}
                handleContainerChange={this.handleContainerChange}
                reviews={this.state.reviews}
                handleReviewClick={this.handleReviewClick}
                reviewsCollapsed={this.state.reviewsCollapsed}
                similar_games={this.state.similar_games}
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