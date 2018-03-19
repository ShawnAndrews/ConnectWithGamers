const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../service/igdb/main';
import { withRouter } from 'react-router-dom';
import { GameResponse, UpcomingGameResponse } from '../../../client/client-server-common/common';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

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
        
        const cardTextPadding = {
            'paddingLeft': '16px'
        };

        return (
            <Card className="menu-game-thumbnail">
                <CardMedia>
                    <img src={this.props.game.cover ? this.props.game.cover : 'https://i.imgur.com/WcPkTiF.png'} onClick={() => { this.props.history.push(`/menu/search/${this.props.game.id}`); }} alt="Game cover" />
                </CardMedia>
                <CardTitle titleColor="rgba(255,255,255,0.6)" subtitleColor="rgba(255,255,255,0.7)" title={this.props.game.name} subtitle={this.props.game.genres} />
                <CardText className="menu-game-thumbnail-icons">
                    {this.props.game.platformIcons && 
                        this.props.game.platformIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} fa-2x menu-game-thumbnail-icons`}/>; })}
                </CardText>
                <CardActions>
                    {this.props.game.steam_url && 
                        <FlatButton label="STEAM PAGE" onClick={() => { window.open(this.props.game.steam_url); }} />}
                </CardActions>
            </Card>
        );

    }

}

export default withRouter(ThumbnailGame);