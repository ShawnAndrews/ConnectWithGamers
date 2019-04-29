import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../client-server-common/common';
import GameList from './GameList';

export enum GameListType {
    Fullsize,
    Search,
    transparent
}

interface IGameListContainerProps extends RouteComponentProps<any> {
    type: GameListType;
    game: GameResponse;
    fullsizeIndex?: number;
    fullsizeIsEditorsChoiceGame?: boolean;
    fullsizeIsBigGame?: boolean;
} 

interface IGameListContainerState { }

class GameListContainer extends React.Component<IGameListContainerProps, IGameListContainerState> {

    constructor(props: IGameListContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
    }

    goToGame(): void {
        this.props.history.push(`/search/game/${this.props.game.id}`);
    }

    render() {
        return (
            <GameList
                type={this.props.type}
                game={this.props.game}
                goToGame={this.goToGame}
                fullsizeIndex={this.props.fullsizeIndex}
                fullsizeIsEditorsChoiceGame={this.props.fullsizeIsEditorsChoiceGame}
                fullsizeIsBigGame={this.props.fullsizeIsBigGame}
            />
        );
    }

}

export default withRouter(GameListContainer);