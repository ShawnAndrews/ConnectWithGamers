const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Game from './Game';
import { SingleGameResponse, GameResponse } from '../../../../../client/client-server-common/common';

interface IGameContainerProps extends RouteComponentProps<any> { }

interface IGameContainerState {
    isLoading: boolean;
    game: GameResponse;
    summaryExpanded: boolean;
    genre_ids: number[];
    gameid: number;
}

class GameContainer extends React.Component<IGameContainerProps, IGameContainerState> {

    constructor(props: IGameContainerProps) {
        super(props);
        this.state = {
            isLoading: false,
            game: undefined,
            summaryExpanded: undefined,
            genre_ids: undefined,
            gameid: undefined
        };
        this.loadGame = this.loadGame.bind(this);
        this.handleSteamClick = this.handleSteamClick.bind(this);
        this.handlePlatformClick = this.handlePlatformClick.bind(this);
        this.handleGenreClick = this.handleGenreClick.bind(this);
        this.expandSummary = this.expandSummary.bind(this);
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
        this.props.history.push(`/games/search/filter/?platforms=${this.state.game.platforms[index].id}`);
    }
    
    handleGenreClick(index: number): void {
        this.props.history.push(`/games/search/filter/?genres=${this.state.game.genres[index].id}`);
    }

    expandSummary(): void {
        this.setState({ summaryExpanded: true });
    }

    render() {
        return (
            <Game
                isLoading={this.state.isLoading}
                gameId={this.state.gameid}
                game={this.state.game}
                summaryExpanded={this.state.summaryExpanded}
                handleSteamClick={this.handleSteamClick}
                handlePlatformClick={this.handlePlatformClick}
                handleGenreClick={this.handleGenreClick}
                expandSummary={this.expandSummary}
            />
        );
    }

}

export default withRouter(GameContainer);