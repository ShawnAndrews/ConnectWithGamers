import * as React from 'react';
import { ThumbnailGameResponse } from '../../../../client/client-server-common/common';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

interface IThumbnailGameProps {
    game: ThumbnailGameResponse;
    goToGame: () => void;
}

const ThumbnailGame: React.SFC<IThumbnailGameProps> = (props: IThumbnailGameProps) => {

    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    return (
        <Card className="menu-game-thumbnail" onClick={props.goToGame}>
            <CardMedia className="menu-game-thumbnail-container">
                <img src={props.game.cover ? props.game.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
            </CardMedia>
            <div className="menu-game-thumbnail-name">
                {props.game.name}
            </div>
            <div className="menu-game-thumbnail-genres">
                {props.game.genres}
            </div>
            <div className="menu-game-thumbnail-icons">
                {props.game.linkIcons && 
                    props.game.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} menu-game-thumbnail-icon`}/>; })}
            </div>
            {props.game.price && 
                <div className="menu-game-thumbnail-steam-container">
                    <span className="menu-game-thumbnail-steam-header">Price: </span>
                    {props.game.price === 'Free'
                        ? <strong>Free</strong>
                        : <span>${props.game.price} USD{props.game.discount_percent !== 0 && <span className="menu-game-thumbnail-steam-discount">(-{props.game.discount_percent} % SALE)</span>}</span>}
                    <a href={props.game.steam_url} className="menu-game-thumbnail-steam-icon"><i className="fab fa-steam-square fa-lg"/></a>
                </div>}
        </Card>
    );

};

export default ThumbnailGame;