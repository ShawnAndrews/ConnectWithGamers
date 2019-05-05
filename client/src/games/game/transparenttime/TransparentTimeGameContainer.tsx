import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../../client-server-common/common';
import TransparentTimeGame from './TransparentTimeGame';

interface ITransparentTimeGameContainerProps extends RouteComponentProps<any> {
    game: GameResponse;
} 

interface ITransparentTimeGameContainerState { }

class TransparentTimeGameContainer extends React.Component<ITransparentTimeGameContainerProps, ITransparentTimeGameContainerState> {

    constructor(props: ITransparentTimeGameContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
    }

    goToGame(): void {
        this.props.history.push(`/search/game/${this.props.game.id}`);
    }

    render() {
        return (
            <TransparentTimeGame
                game={this.props.game}
                goToGame={this.goToGame}
                
            />
        );
    }

}

export default withRouter(TransparentTimeGameContainer);