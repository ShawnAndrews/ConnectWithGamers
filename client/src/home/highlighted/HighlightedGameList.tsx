import * as React from 'react';
import { GameResponse } from '../../../client-server-common/common';
import { Card } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface IHighlightedGameListProps {
    games: GameResponse[];
    onClickGame: (id: number) => void;
    randColors: boolean[];
    onHoverGame: (index: number) => void;
    onHoverOutGame: () => void;
    hoveredGameId: number;
}

const PopularGameList: React.SFC<IHighlightedGameListProps> = (props: IHighlightedGameListProps) => {

    const featuredGames: number[] = [4];

    return (
        <div className="highlighted-table col-lg-8 px-md-1 px-lg-3">
            <div className="highlighted-header">
                <a className="mr-2">Highlights</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <div className="highlighted-games">
                {props.games && props.games
                    .map((game: GameResponse, index: number) => {
                        const isFeatureGame: boolean = featuredGames.findIndex((x: number) => x === index) !== -1;
                        
                        return (
                            <Card className={`game ${isFeatureGame ? 'feature' : ''} primary-shadow position-relative bg-transparent h-100`} onClick={() => { props.onClickGame(game.id); }} onMouseOver={() => props.onHoverGame(index)} onMouseOut={() => props.onHoverOutGame()}>
                                <div className={`${props.randColors[index] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === index && 'active'} w-100`}/>
                                {game.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{game.discount_percent}%</div>}
                                <div className='text-overlay'/>
                                <div className="highlighted-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {game.name}
                                    </Textfit>
                                    {game.genres &&
                                        <div className="genre">
                                            {game.genres[0].name}
                                        </div>}
                                    {game.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(game.aggregated_rating)}%
                                        </div>}
                                </div>
                                <img className="w-100 h-100" src={game.screenshots ? game.screenshots[0] : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );   

};

export default PopularGameList;