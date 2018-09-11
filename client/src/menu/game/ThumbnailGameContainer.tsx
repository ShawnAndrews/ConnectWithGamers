import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { UpcomingGameResponse, GenreGame, RecentGameResponse, PlatformGame } from '../../../../client/client-server-common/common';
import ThumbnailGame from './ThumbnailGame';

interface IThumbnailGameContainerProps extends RouteComponentProps<any> {
    game: UpcomingGameResponse | GenreGame | RecentGameResponse | PlatformGame;
} 

interface IThumbnailGameContainerState { }

class ThumbnailGameContainer extends React.Component<IThumbnailGameContainerProps, IThumbnailGameContainerState> {

    constructor(props: IThumbnailGameContainerProps) {
        super(props);
        this.goToGame = this.goToGame.bind(this);
    }

    goToGame(): void {
        this.props.history.push(`/menu/search/${this.props.game.id}`);
    }

    render() {
        return (
            <ThumbnailGame
                game={this.props.game}
                goToGame={this.goToGame}
            />
        );
    }

}

export default withRouter(ThumbnailGameContainer);