import * as React from 'react';
import { GameResponse } from '../../../../client-server-common/common';
import ReactStars from 'react-stars';
import PriceContainer from '../../price/PriceContainer';

interface ITransparentGameProps {
    game: GameResponse;
    goToGame: () => void;
}

const TransparentGame: React.SFC<ITransparentGameProps> = (props: ITransparentGameProps) => {

    return (
        <div className="price-item">
            <div onClick={props.goToGame}>
                <img className="cover-img" src={props.game.cover} alt="Game cover"/>
                <div className="name mt-2 mx-auto">
                    {props.game.name}
                </div>
                <div className="stars-container mx-auto">
                    <ReactStars
                        count={5}
                        value={props.game.review.id ? (props.game.review.id / 100) * 5 : 0}
                        size={13}
                        edit={false}
                    />
                </div>
                <PriceContainer
                    game={props.game}
                    showTextStatus={true}
                />
            </div>
        </div>
    );

};

export default TransparentGame;
