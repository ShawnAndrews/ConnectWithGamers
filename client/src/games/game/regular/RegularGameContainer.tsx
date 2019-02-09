import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../../client-server-common/common';
import RegularGame from './RegularGame';

interface IRegularGameContainerProps extends RouteComponentProps<any> {
    game: GameResponse;
} 

interface IRegularGameContainerState { }

class RegularGameContainer extends React.Component<IRegularGameContainerProps, IRegularGameContainerState> {

    constructor(props: IRegularGameContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
    }

    goToGame(): void {
        this.props.history.push(`/search/game/${this.props.game.id}`);
    }

    render() {
        return (
            <RegularGame
                game={this.props.game}
                goToGame={this.goToGame}
            />
        );
    }

}

export default withRouter(RegularGameContainer);