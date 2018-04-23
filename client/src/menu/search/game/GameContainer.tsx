const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter } from 'react-router-dom';
import Game from './Game';
import { SingleGameResponse, SteamAPIReview, GameResponse } from '../../../../../client/client-server-common/common';

interface IGameContainerProps {
    gameId: string;
    history: any;
}

class GameContainer extends React.Component<IGameContainerProps, any> {

    constructor(props: IGameContainerProps) {
        super(props);
        this.state = {};
        this.loadGame = this.loadGame.bind(this);
        this.handleReadReviewsClick = this.handleReadReviewsClick.bind(this);
        this.handlePlatformClick = this.handlePlatformClick.bind(this);
        this.handleGenreClick = this.handleGenreClick.bind(this);
        this.expandSummary = this.expandSummary.bind(this);

        // load game
        if (this.props.gameId) {
            this.state = { isLoading: true, summaryExpanded: false, reviewsExpanded: false };
            this.loadGame(this.props.gameId);
        }
    }

    componentWillReceiveProps(newProps: IGameContainerProps) {
        // load new game
        if (newProps.gameId && this.props.gameId !== newProps.gameId) {
            this.setState({ isLoading: true });
            this.loadGame(newProps.gameId);
        }
    }

    loadGame(id: string): void {
        IGDBService.httpGetGame(id)
            .then( (response: SingleGameResponse) => {
                const game: GameResponse = response.data; 
                this.setState({ isLoading: false, game: game });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
    }

    handlePlatformClick(index: number): void {
        this.props.history.push(`/menu/platform/${this.state.game.platform_ids[index]}`);
    }
    
    handleGenreClick(index: number): void {
        this.props.history.push(`/menu/genre/${this.state.game.genre_ids[index]}`);
    }

    handleReadReviewsClick(): void {
        this.setState({ reviewsExpanded: !this.state.reviewsExpanded });
    }

    expandSummary(): void {
        this.setState({ summaryExpanded: true });
    }

    render() {
        return (
            <Game
                isLoading={this.state.isLoading}
                gameId={this.props.gameId}
                game={this.state.game}
                summaryExpanded={this.state.summaryExpanded}
                reviewsExpanded={this.state.reviewsExpanded}
                handlePlatformClick={this.handlePlatformClick}
                handleGenreClick={this.handleGenreClick}
                handleReadReviewsClick={this.handleReadReviewsClick}
                expandSummary={this.expandSummary}
            />
        );
    }

}

export default withRouter(GameContainer);