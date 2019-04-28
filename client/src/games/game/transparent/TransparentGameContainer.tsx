import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../../client-server-common/common';
import TransparentGame from './TransparentGame';

interface ITransparentGameContainerProps extends RouteComponentProps<any> {
    game: GameResponse;
} 

interface ITransparentGameContainerState { }

class TransparentGameContainer extends React.Component<ITransparentGameContainerProps, ITransparentGameContainerState> {

    constructor(props: ITransparentGameContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
    }

    goToGame(): void {
        this.props.history.push(`/search/game/${this.props.game.id}`);
    }

    render() {
        return (
            <TransparentGame
                game={this.props.game}
                goToGame={this.goToGame}
            />
        );
    }

}

export default withRouter(TransparentGameContainer);