import * as React from 'react';
import { GameResponse, steamAppUrl, IGDBGenre } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import { Card, Button } from '@material-ui/core';
import { Textfit } from 'react-textfit';
import CrossfadeImage from 'react-crossfade-image';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    hoveredIndex: number;
    hoveredScreenshotIndex: number;
    goToRedirect: (URL: string) => void;
    onHoverGame: (index: number) => void;
    onHoverOutGame: (index: number) => void;
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="vh-40" loadingMsg={props.loadingMsg} />
        );
    }

    const featureGames: number[] = [0,42];
    const subFeatureGames: number[] = [10,17,28,33];

    return (
        <div className="home">
            {props.games && props.games
                .map((game: GameResponse, index: number) => {
                    const isEditorsChoiceGame: boolean = index === 0;
                    const isFeatureGame: boolean = featureGames.findIndex((x: number) => x === index) !== -1;
                    const isSubFeatureGame: boolean = subFeatureGames.findIndex((x: number) => x === index) !== -1;

                    return (
                        <Card className={`game-${index} ${isFeatureGame ? 'feature' : ''} ${isSubFeatureGame ? 'sub-feature' : ''} ${isEditorsChoiceGame ? 'overflow-visible' : ''} primary-shadow position-relative bg-transparent cursor-pointer h-100`} onClick={() => props.goToRedirect(`/games/search/game/${game.id}`)} onMouseOver={() => props.onHoverGame(index)} onMouseOut={() => props.onHoverOutGame(index)}>
                            <div className="screenshot w-100 h-100">
                                <CrossfadeImage src={game.screenshots ? game.screenshots[`${props.hoveredIndex === index ? props.hoveredScreenshotIndex : 0}`] : 'https://i.imgur.com/WcPkTiF.png'} />
                            </div>
                            <div className='overlay'/>
                            <div className='text-overlay'/>
                            {isEditorsChoiceGame &&
                                <>
                                    <div className="filter w-100 h-100" />
                                    <img className="editor-banner" src="https://i.imgur.com/fRULvuf.png" />
                                    <div className="editor-banner-text">Editor's Choice</div>
                                    {game.discount_percent && 
                                        <>
                                            <img className="discount-banner" src="https://i.imgur.com/taEmL2H.png" />
                                            <div className="discount-banner-text">{game.discount_percent}% off</div>
                                        </>}
                                </>}
                            <div className={`highlighted-table-text ${isEditorsChoiceGame ? 'editors-choice' : ''}`}>
                                {!isEditorsChoiceGame
                                    ?
                                    <>
                                        <Textfit className='name' min={11} max={15}>
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
                                    </>
                                    :
                                    <>
                                        <Textfit className='name' min={18} max={30}>
                                            {game.name}
                                        </Textfit>
                                        <div className='genres'>
                                            {game.genres && game.genres.map((x: IGDBGenre) => x.name).join(', ')}
                                        </div>
                                        <Button
                                            className="steam-btn" 
                                            variant="raised"
                                            onClick={() => props.goToRedirect(`${steamAppUrl}/${game.steamid}`) }
                                        >
                                            Buy now
                                        </Button>
                                    </>}
                            </div>
                        </Card>
                    );
                })}
        </div>
    );

};

export default Home;