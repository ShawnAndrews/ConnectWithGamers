const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../service/igdb/main';
import { withRouter } from 'react-router-dom';
import Spinner from '../loader/spinner';
import { ResponseModel, GameResponse, UpcomingGameResponse } from '../../../client/client-server-common/common';

interface IThumbnailGameProps {
    history: any;
    game: UpcomingGameResponse;
}

class ThumbnailGame extends React.Component<IThumbnailGameProps, any> {

    constructor(props: IThumbnailGameProps) {
        super(props);
    }

    render() {
        const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        
        return (
            <div className="menu-game" onClick={() => { this.props.history.push(`/menu/search/${this.props.game.id}`); }}>
                <div className="menu-item-overlay"/>
                <img className="menu-game-cover" height="100%" width="100%" src={this.props.game.cover ? this.props.game.cover : 'https://i.imgur.com/TPRlZkd.png'} alt="Game cover"/>
                {!this.props.game.cover && 
                    <div className="menu-game-upcoming-name">{this.props.game.name}</div>}
            </div>
        );

    }

}

export default withRouter(ThumbnailGame);