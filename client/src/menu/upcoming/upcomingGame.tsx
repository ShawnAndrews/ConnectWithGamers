const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter } from 'react-router-dom';
import Spinner from '../../loader/spinner';
import { ResponseModel, GameResponse, UpcomingGameResponse } from '../../../../client/client-server-common/common';

interface IUpcomingGameProps {
    history: any;
    upcomingGame: UpcomingGameResponse;
}

class UpcomingGame extends React.Component<IUpcomingGameProps, any> {

    constructor(props: IUpcomingGameProps) {
        super(props);
    }

    render() {
        const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        
        return (
            <div className="menu-game" onClick={() => { this.props.history.push(`/menu/search/${this.props.upcomingGame.id}`); }}>
                <img className="menu-game-cover" height="100%" width="100%" src={this.props.upcomingGame.cover ? this.props.upcomingGame.cover : 'https://i.imgur.com/TPRlZkd.png'} alt="Game cover"/>
                {!this.props.upcomingGame.cover && 
                    <div className="menu-game-upcoming-name">{this.props.upcomingGame.name}</div>}
            </div>
        );

    }

}

export default withRouter(UpcomingGame);