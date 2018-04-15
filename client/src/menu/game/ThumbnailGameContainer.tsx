const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { UpcomingGameResponse } from '../../../../client/client-server-common/common';
import ThumbnailGame from './ThumbnailGame';

interface IThumbnailGameContainerProps {
    history: any;
    game: UpcomingGameResponse;
}

class ThumbnailGameContainer extends React.Component<IThumbnailGameContainerProps, any> {

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