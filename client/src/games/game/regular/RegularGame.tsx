import * as React from 'react';
import { GameResponse, steamAppUrl, IdNamePair } from '../../../../client-server-common/common';
import { Paper } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IRegularGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const RegularGame: React.SFC<IRegularGameProps> = (props: IRegularGameProps) => {

    return (
        <div className="col-12 col-lg-6 col-xl-4 px-4 px-md-2 my-2">
            <Paper className="game bg-tertiary hover-tertiary-solid position-relative" onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover ? props.game.cover.url : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <Textfit className="name color-secondary font-weight-bold text-nowrap text-right px-2" min={12} max={18}>
                    {props.game.name}
                </Textfit>
                <div className="genres font-italic text-nowrap text-right px-2">
                    {props.game.genres && 
                        props.game.genres.map((x: IdNamePair) => x.name).join(", ")}
                </div>
                <div className="icons color-secondary text-nowrap text-right px-2">
                    {props.game.linkIcons && 
                        props.game.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} mx-1`}/>; })}
                </div>
                {props.game.price && 
                    <Textfit className="price color-secondary text-nowrap text-right px-2" max={14}>
                        {(props.game.price === 'Free' || props.game.price === 'Coming Soon')
                            ? <span className="plain-text">{props.game.price}</span>
                            : <span>${props.game.price} USD{props.game.discount_percent && props.game.discount_percent !== 0 && <i className="discount-text ml-1">(-{props.game.discount_percent}%)</i>}</span>}
                        <a href={`${steamAppUrl}/${props.game.steamid}`}><i className="fab fa-steam-square fa-lg color-secondary ml-2"/></a>
                    </Textfit>}
            </Paper>
        </div>
    );

};

export default RegularGame;