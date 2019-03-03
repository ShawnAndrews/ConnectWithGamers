import * as React from 'react';
import { GameResponse, GenreEnums, getCachedIGDBImage, IGDBImageSizeEnums, getIGDBImage } from '../../../../client-server-common/common';
import { Paper } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IRegularGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const RegularGame: React.SFC<IRegularGameProps> = (props: IRegularGameProps) => {

    return (
        <div className="col-12 col-lg-6 col-xl-4 px-4 px-md-2 my-2">
            <Paper className="game hover-tertiary-solid cursor-pointer position-relative" onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover ? (props.game.image_cover_big_cached ? getCachedIGDBImage(props.game.cover.image_id, IGDBImageSizeEnums.cover_big) : getIGDBImage(props.game.cover.image_id, IGDBImageSizeEnums.cover_big)) : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <Textfit className="name color-secondary font-weight-bold text-nowrap text-right px-2" min={12} max={18}>
                    {props.game.name}
                </Textfit>
                <div className="genres font-italic text-nowrap text-right px-2">
                    {props.game.genres && 
                        props.game.genres.map((x: number) => GenreEnums[x]).join(", ")}
                </div>
                <div className="icons color-secondary text-nowrap text-right px-2">
                    {props.game.linkIcons && 
                        props.game.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} mx-1`}/>; })}
                </div>
                {/* {props.game.external.steam && 
                    <Textfit className="price color-secondary text-nowrap text-right px-2" max={14}>
                        {(props.game.external.steam.price === 'Free' || props.game.external.steam.price === 'Coming Soon')
                            ? <span className="plain-text">{props.game.external.steam.price}</span>
                            : <span>${props.game.external.steam.price} USD{props.game.external.steam.discount_percent && props.game.external.steam.discount_percent !== 0 && <i className="discount-text ml-1">(-{props.game.external.steam.discount_percent}%)</i>}</span>}
                        <a href={`${props.game.external.steam.url}`}><i className="fab fa-steam-square fa-lg color-secondary ml-2"/></a>
                    </Textfit>} */}
            </Paper>
        </div>
    );

};

export default RegularGame;