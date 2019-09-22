import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse } from '../../../../client-server-common/common';
import SearchGame from './SearchGame';

interface ISearchGameContainerProps extends RouteComponentProps<any> {
    game: GameResponse;
} 

interface ISearchGameContainerState { }

class SearchGameContainer extends React.Component<ISearchGameContainerProps, ISearchGameContainerState> {

    constructor(props: ISearchGameContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
    }

    goToGame(): void {
        this.props.history.push(`/search/game/${this.props.game.steamId}`);
    }

    render() {
        return (
            <SearchGame
                game={this.props.game}
                goToGame={this.goToGame}
            />
        );
    }

}

export default withRouter(SearchGameContainer);