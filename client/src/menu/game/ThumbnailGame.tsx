const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { ChatroomUser, UpcomingGameResponse } from '../../../../client/client-server-common/common';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

interface IThumbnailGameProps {
    game: UpcomingGameResponse;
    goToGame: () => void;
}

const ThumbnailGame: React.SFC<IThumbnailGameProps> = (props: IThumbnailGameProps) => {

    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    return (
        <Card className="menu-game-thumbnail">
            <CardMedia>
                <img src={props.game.cover ? props.game.cover : 'https://i.imgur.com/WcPkTiF.png'} onClick={props.goToGame} alt="Game cover" />
            </CardMedia>
            <CardTitle title={props.game.name} subtitle={props.game.genres} />
            <CardText className="menu-game-thumbnail-icons">
                {props.game.linkIcons && 
                    props.game.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} fa-2x menu-game-thumbnail-icons`}/>; })}
            </CardText>
            <CardActions>
                {props.game.steam_url && 
                    <FlatButton label="STEAM PAGE" onClick={() => { window.open(props.game.steam_url); }} />}
            </CardActions>
        </Card>
    );

};

export default ThumbnailGame;