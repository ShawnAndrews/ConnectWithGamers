import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import { formatDate } from '../../../util/main';
import ReactStars from 'react-stars';

interface ITransparentTimeGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const TransparentTimeGame: React.SFC<ITransparentTimeGameProps> = (props: ITransparentTimeGameProps) => {

    return (
        <div className="time-item ml-2">
            <div className="mr-3" onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover  || 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                <div className="left-text ml-2 align-top d-inline-block">
                    <div className="name">
                        {props.game.name}
                    </div>
                    {props.game.aggregated_rating && 
                        <ReactStars
                            count={5}
                            value={props.game.aggregated_rating ? (props.game.aggregated_rating / 100) * 5 : 0}
                            size={16}
                            edit={false}
                        />}
                    <div className="platform-icons">
                        {props.game.linkIcons && props.game.linkIcons
                            .map((icon: string) => (
                                <i className={`${icon} mx-1`}/>
                            ))}
                    </div>
                    <div className="genres font-italic">
                        {props.game.genres && props.game.genres.join(`, `)}
                    </div>
                </div>
                <div className="right-text align-top d-inline-block">
                    <div className="time">
                        {formatDate(props.game.first_release_date)}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default TransparentTimeGame;
