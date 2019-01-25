const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Game from './Game';
import { SingleGameResponse, GameResponse } from '../../../../../client/client-server-common/common';
import { loggedIn } from '../../../service/account/main';

interface IGameContainerProps extends RouteComponentProps<any> { }

interface IGameContainerState {
    isLoading: boolean;
    game: GameResponse;
    summaryExpanded: boolean;
    genre_ids: number[];
    gameid: number;
    gameRatedSnackbarOpen: boolean;
}

class GameContainer extends React.PureComponent<IGameContainerProps, IGameContainerState> {

    constructor(props: IGameContainerProps) {
        super(props);
        this.state = {
            isLoading: false,
            game: undefined,
            summaryExpanded: undefined,
            genre_ids: undefined,
            gameid: undefined,
            gameRatedSnackbarOpen: false
        };
        this.loadGame = this.loadGame.bind(this);
        this.handleSteamClick = this.handleSteamClick.bind(this);
        this.handlePlatformClick = this.handlePlatformClick.bind(this);
        this.handleGenreClick = this.handleGenreClick.bind(this);
        this.expandSummary = this.expandSummary.bind(this);
        this.onRateStarsClick = this.onRateStarsClick.bind(this);
        this.gameRatedSnackbarClose = this.gameRatedSnackbarClose.bind(this);
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
        IGDBService.httpGenericGetData<SingleGameResponse>(`/igdb/game/${id}`)
            .then( (response: SingleGameResponse) => {
                const game: GameResponse = response.data; 
                this.setState({ isLoading: false, game: game, gameid: id });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
    }

    handleSteamClick(url: string): void {
        window.open(url);
    }

    handlePlatformClick(index: number): void {
        this.props.history.push(`/games/search/filter/?platforms=${this.state.game.platforms[index]}`);
    }
    
    handleGenreClick(index: number): void {
        this.props.history.push(`/games/search/filter/?genres=${this.state.game.genres[index]}`);
    }

    expandSummary(): void {
        this.setState({ summaryExpanded: true });
    }

    onRateStarsClick(rating: number): void {
        
        if (loggedIn()) {

            IGDBService.httpGenericGetData<void>(`/account/game/rate/?id=${this.state.gameid}&rating=${rating}`)
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

    render() {
        return (
            <Game
                isLoading={this.state.isLoading}
                gameId={this.state.gameid}
                game={this.state.game}
                summaryExpanded={this.state.summaryExpanded}
                gameRatedSnackbarOpen={this.state.gameRatedSnackbarOpen}
                handleSteamClick={this.handleSteamClick}
                handlePlatformClick={this.handlePlatformClick}
                handleGenreClick={this.handleGenreClick}
                expandSummary={this.expandSummary}
                onRateStarsClick={this.onRateStarsClick}
                gameRatedSnackbarClose={this.gameRatedSnackbarClose}
            />
        );
    }

}

export default withRouter(GameContainer);