import * as React from 'react';
import { ChatroomUser, UpcomingGameResponse, GenreGame, RecentGameResponse, PlatformGame } from '../../../../client/client-server-common/common';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

interface IThumbnailGameProps {
    game: UpcomingGameResponse | GenreGame | RecentGameResponse | PlatformGame;
    goToGame: () => void;
}

const ThumbnailGame: React.SFC<IThumbnailGameProps> = (props: IThumbnailGameProps) => {

    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    return (
        <Card className="menu-game-thumbnail">
            {/* <CardMedia className="menu-game-thumbnail-container">
                <img src={props.game.cover ? props.game.cover : 'https://i.imgur.com/WcPkTiF.png'} onClick={props.goToGame} alt="Game cover" width="100%"/>
            </CardMedia>
            <CardHeader title={props.game.name} subheader={props.game.genres} />
            <CardContent className="menu-game-thumbnail-icons">
                {props.game.linkIcons && 
                    props.game.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} fa-2x menu-game-thumbnail-icons`}/>; })}
            </CardContent>
            <CardActions>
                {props.game.steam_url && 
                    <Button variant="contained" onClick={() => { window.open(props.game.steam_url); }}>
                        STEAM PAGE
                    </Button>}
            </CardActions> */}
        </Card>
    );

};

export default ThumbnailGame;