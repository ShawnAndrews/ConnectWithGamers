import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import SingleSlide from './SingleSlide';
import TripleSlide from './TripleSlide';
import QuadrupleSlide from './QuadrupleSlide';

interface IDiscountGameListProps {
    discountedGames: GameResponse[];
    onRedirect: (id: number) => void;
    onHoverGame: (gameId: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
}

const DiscountedGameList: React.SFC<IDiscountGameListProps> = (props: IDiscountGameListProps) => {

    return (
        <div className="discount-carousel col-12 p-0 my-3 mb-5">
            {props.discountedGames.length > 12 && 
                <>
                    {props.discountedGames.length > 1 &&
                        <SingleSlide
                            games={props.discountedGames.slice(0, 1)}
                            onRedirect={props.onRedirect}
                            onHoverGame={props.onHoverGame}
                            onHoverOutGame={props.onHoverOutGame}
                            hoveredGameId={props.hoveredGameId}
                        />}
                    {props.discountedGames.length > 5 &&
                        <QuadrupleSlide
                            games={props.discountedGames.slice(1, 5)}
                            onRedirect={props.onRedirect}
                            onHoverGame={props.onHoverGame}
                            onHoverOutGame={props.onHoverOutGame}
                            hoveredGameId={props.hoveredGameId}
                        />}
                    {props.discountedGames.length > 8 &&
                        <TripleSlide
                            games={props.discountedGames.slice(5, 8)}
                            onRedirect={props.onRedirect}
                            onHoverGame={props.onHoverGame}
                            onHoverOutGame={props.onHoverOutGame}
                            hoveredGameId={props.hoveredGameId}
                        />}
                    {props.discountedGames.length > 12 &&
                        <QuadrupleSlide
                            games={props.discountedGames.slice(8, 12)}
                            onRedirect={props.onRedirect}
                            onHoverGame={props.onHoverGame}
                            onHoverOutGame={props.onHoverOutGame}
                            hoveredGameId={props.hoveredGameId}
                        />}
                </>}
            {props.discountedGames && 
                props.discountedGames.slice(props.discountedGames.length > 12 ? 12 : 0).map((game: GameResponse) => (
                    <SingleSlide
                        games={[game]}
                        onRedirect={props.onRedirect}
                        onHoverGame={props.onHoverGame}
                        onHoverOutGame={props.onHoverOutGame}
                        hoveredGameId={props.hoveredGameId}
                    />
                ))}
        </div>
    );   

};

export default DiscountedGameList;