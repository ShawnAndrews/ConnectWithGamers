import * as React from 'react';
import { ThumbnailGameResponse } from '../../../../client/client-server-common/common';
import { Paper } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IThumbnailGameProps {
    game: ThumbnailGameResponse;
    goToGame: () => void;
}

const ThumbnailGame: React.SFC<IThumbnailGameProps> = (props: IThumbnailGameProps) => {

    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    return (
        <div className="col-md-6 col-lg-4 px-4 px-md-2 my-2">
            <Paper className="game bg-primary hover-primary position-relative" onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover ? props.game.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <Textfit className="name color-secondary font-weight-bold text-nowrap text-right px-2" min={12} max={18}>
                    {props.game.name}
                </Textfit>
                <div className="genres font-italic text-nowrap text-right px-2">
                    {props.game.genres}
                </div>
                <div className="icons color-secondary text-nowrap text-right px-2">
                    {props.game.linkIcons && 
                        props.game.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} mx-1`}/>; })}
                </div>
                {props.game.price && 
                    <Textfit className="price color-secondary text-nowrap text-right px-2" max={14}>
                        {props.game.price === 'Free'
                            ? <span className="free-text">Free</span>
                            : <span>${props.game.price} USD{props.game.discount_percent !== 0 && <i className="discount-text ml-1">(-{props.game.discount_percent} % SALE)</i>}</span>}
                        <a href={props.game.steam_url}><i className="fab fa-steam-square fa-lg color-secondary ml-2"/></a>
                    </Textfit>}
            </Paper>
        </div>
    );

};

export default ThumbnailGame;