import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import { Paper } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface ISearchGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const SearchGame: React.SFC<ISearchGameProps> = (props: ISearchGameProps) => {

    return (
        <div className="col-12 col-lg-6 col-xl-4 px-4 px-md-2 my-2">
            <Paper className="game hover-tertiary-solid cursor-pointer position-relative" onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover || 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <Textfit className="name color-secondary font-weight-bold text-nowrap text-right px-2" min={12} max={18}>
                    {props.game.name}
                </Textfit>
                <div className="genres font-italic text-nowrap text-right px-2">
                    {props.game.genres && 
                        props.game.genres.join(", ")}
                </div>
                {/* <div className="icons color-secondary text-nowrap text-right px-2">
                    {props.game.linkIcons && 
                        props.game.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} mx-1`}/>; })}
                </div> */}
            </Paper>
        </div>
    );

};

export default SearchGame;