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

const HighlightedGameList: React.SFC<IHighlightedGameListProps> = (props: IHighlightedGameListProps) => {

    const featuredGames: number[] = [4];

    return (
        <div className="highlighted-table mb-5">
            <div className="highlighted-header position-relative mb-2">
                <a className="mr-2">Highlights</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <div className="highlighted-games">
                {props.games && props.games
                    .map((game: GameResponse, index: number) => {
                        const isFeatureGame: boolean = featuredGames.findIndex((x: number) => x === index) !== -1;
                        const originalPrice: number = + (Number.parseFloat(game.external.steam.price) / ((100 - game.external.steam.discount_percent) / 100)).toFixed(2);

                        return (
                            <Card className={`game ${isFeatureGame ? 'feature' : ''} primary-shadow position-relative bg-transparent h-100`} onClick={() => { props.onClickGame(game.id); }} onMouseOver={() => props.onHoverGame(index)} onMouseOut={() => props.onHoverOutGame()}>
                                <div className={`${props.randColors[index] ? 'cover-overlay-green' : 'cover-overlay-yellow'} ${props.hoveredGameId === index && 'active'} w-100`}/>
                                {game.external.steam.discount_percent && <div className="highlighted-table-discount mt-1 px-1">-{game.external.steam.discount_percent}%</div>}
                                <div className='text-overlay'/>
                                <div className="highlighted-table-text">
                                    <Textfit className="name" min={11} max={15}>
                                        {game.name}
                                    </Textfit>
                                    {game.genres &&
                                        <div className="genre w-100">
                                            {game.genres[0].name}
                                        </div>}
                                </div>
                                {game.external.steam &&
                                    <div className={`price-container ${!game.external.steam.discount_percent ? 'no-discount': ''} mt-1`}>
                                        {game.external.steam.discount_percent && 
                                            <>
                                                <div className="discount d-inline-block px-1">-{game.external.steam.discount_percent}%</div>
                                                <div className="original-price d-inline-block px-1"><del>${originalPrice} USD</del></div>
                                            </>}
                                        <div className={`final-price d-inline-block ${game.external.steam.discount_percent ? 'px-1' : 'px-3'}`}>{!isNaN(Number(game.external.steam.price)) ? `$${game.external.steam.price} USD` : game.external.steam.price}</div>
                                    </div>}
                                <img className="w-100 h-100" src={game.screenshots ? game.screenshots[0].url : 'https://i.imgur.com/WcPkTiF.png'}/>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );   

};

export default HighlightedGameList;