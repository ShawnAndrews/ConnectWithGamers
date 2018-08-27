const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import Spinner from '../../../spinner/main';
import { GameResponse } from '../../../../../client/client-server-common/common';
import Button from '@material-ui/core/Button';
import Cover from './Cover';
import Summary from './Summary';
import ReleaseDate from './ReleaseDate';
import Platforms from './Platforms';
import Genres from './Genres';
import Media from './Media';
import Reviews from './Reviews';

interface IGameProps {
    isLoading: boolean;
    gameId: string;
    game: GameResponse;
    summaryExpanded: boolean;
    reviewsExpanded: boolean;
    handlePlatformClick: (index: number) => void;
    handleGenreClick: (index: number) => void;
    handleReadReviewsClick: () => void;
    expandSummary: () => void;
}

const Game: React.SFC<IGameProps> = (props: IGameProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-center">
                <Spinner loadingMsg="Loading game..." />
            </div>
        );
    }
    
    if (!props.gameId) {
        return (
            <div className="menu-choose-game">
                <i className="fas fa-arrow-right fa-6x menu-choose-game-arrow" data-fa-transform="rotate-270"/>
                <strong className="menu-choose-game-text">Search a Game</strong>
            </div>
        );
    }

    let mediaTitle: string = undefined;

    if (props.game.video && props.game.screenshots) {
        mediaTitle = "Trailer / Screenshots";
    } else if (props.game.video) {
        mediaTitle = "Trailer";
    } else {
        mediaTitle = "Screenshots";
    }

    return (
        <div>
            {props.gameId && 
                <div className="menu-game">
                    <Cover 
                        cover={props.game.cover}
                        rating={props.game.rating}
                        rating_count={props.game.rating_count}
                        price={props.game.price}
                        discount_percent={props.game.discount_percent}
                        steam_url={props.game.steam_url}
                        name={props.game.name}
                    />
                    <Summary 
                        summary={props.game.summary}
                        summaryExpanded={props.summaryExpanded}
                        expandSummary={props.expandSummary}
                    />
                    {props.game.summary && <hr className="line-divider" />}
                    <ReleaseDate 
                        next_release_date={props.game.next_release_date}
                    />
                    <hr className="line-divider" />
                    <Platforms 
                        platforms={props.game.platforms}
                        platforms_release_dates={props.game.platforms_release_dates}
                        handlePlatformClick={props.handlePlatformClick}
                    />
                    {props.game.platforms && <hr className="line-divider" />}
                    <Genres 
                        genres={props.game.genres}
                        handleGenreClick={props.handleGenreClick}
                    />
                    {props.game.genres && <hr className="line-divider" />}
                    <Media
                        video={props.game.video && props.game.video.youtube_link}
                        screenshots={props.game.screenshots}
                        mediaTitle={mediaTitle}
                    />
                    {(props.game.video || props.game.screenshots) && <hr className="line-divider" />}
                    <Reviews 
                        reviews={props.game.reviews}
                        reviewsExpanded={props.reviewsExpanded}
                        handleReadReviewsClick={props.handleReadReviewsClick}
                    />
                    {props.game.reviews && <hr className="line-divider" />}
                </div>}
        </div>
    );

};

export default Game;