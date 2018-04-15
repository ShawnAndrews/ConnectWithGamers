const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import Spinner from '../../spinner/main';
import Slideshow from './slideshow';
import RaisedButton from 'material-ui/RaisedButton';
import Truncate from 'react-truncate';
import { GameResponse, SteamAPIReview } from '../../../../client/client-server-common/common';

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
    return (
        <div>
            {props.gameId && 
                <div className="menu-game">
                    {props.game.cover && 
                        <img className="menu-game-cover" width="100%" src={props.game.cover} alt="Game cover"/>}
                    <h1 className="menu-game-name">{props.game.name}</h1>
                    {props.game.rating && 
                        <span className="menu-game-rating-stars">
                            {props.game.rating > 0
                                ? props.game.rating <= 10 
                                    ? <i className="fas fa-star-half fa-2x"/> 
                                    : <i className="fas fa-star fa-2x"/>
                                : props.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                            {props.game.rating > 20
                                ? props.game.rating <= 30 
                                    ? <i className="fas fa-star-half fa-2x"/> 
                                    : <i className="fas fa-star fa-2x"/>
                                : props.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                            {props.game.rating > 40
                                ? props.game.rating <= 50 
                                    ? <i className="fas fa-star-half fa-2x"/> 
                                    : <i className="fas fa-star fa-2x"/>
                                : props.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                            {props.game.rating > 60
                                ? props.game.rating <= 70 
                                    ? <i className="fas fa-star-half fa-2x"/> 
                                    : <i className="fas fa-star fa-2x"/>
                                : props.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                            {props.game.rating > 80
                                ? props.game.rating <= 90 
                                    ? <i className="fas fa-star-half fa-2x"/> 
                                    : <i className="fas fa-star fa-2x"/>
                                : props.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                        </span>}
                        {props.game.rating_count !== undefined && 
                            <span className="menu-game-rating-count">({props.game.rating_count} ratings)</span>}
                        {props.game.price && 
                            <div className="menu-game-price">
                                <h2 className="menu-game-price-header">Price: </h2>
                                {props.game.price === 'Free'
                                ? <strong>Free</strong>
                                : <i>${props.game.price} USD {props.game.discount_percent !== 0 && '(-' + props.game.discount_percent + '% SALE)'}</i>}
                                <a href={props.game.steam_url} className="menu-game-releasedate-icon"><i className="fab fa-steam-square fa-2x"/></a>
                            </div>}
                        <div className="menu-game-releasedate">
                            <h2 className="menu-game-releasedate-header">Next release: </h2>
                            <i>{props.game.next_release_date ? props.game.next_release_date : 'No planned releases'}</i>
                        </div>
                        {props.game.platforms && 
                            <div className="menu-game-platforms">
                                <h2 className="menu-game-platforms-header">Platforms: </h2>
                                <ul>
                                {props.game.platforms
                                    .map((x: string, index: number) => {
                                        return (
                                            <li key={x}><div className="menu-game-platforms-name-container"><RaisedButton className="menu-game-platforms-name" label={x} onClick={() => { props.handlePlatformClick(index); }}/></div><i className="menu-game-platforms-releasedate">({props.game.platforms_release_dates[index] !== `undefined. NaN, NaN` ? props.game.platforms_release_dates[index] : `N/A`})</i></li>
                                        );
                                    })}
                                </ul>
                            </div>}
                        {props.game.genres && 
                            <div className="menu-game-genres">
                                <h2 className="menu-game-genres-header">Genres: </h2>
                                {props.game.genres
                                    .map((x: string, index: number) => {
                                        return (
                                            <span key={x}><RaisedButton className="menu-game-genres-name" label={x} onClick={() => { props.handleGenreClick(index); }}/>{index !== (props.game.genres.length - 1) && ` , `}</span>
                                        );
                                    })}
                            </div>}
                        {props.game.summary && 
                            <div className="menu-game-summary">
                                <h2>Summary:</h2>
                                <div className="menu-game-summary-text">
                                    {!props.summaryExpanded
                                    ? <Truncate lines={5} ellipsis={<i onClick={props.expandSummary}>  ... Read more</i>}>{props.game.summary}</Truncate>
                                    : props.game.summary}
                                </div>
                            </div>}
                        {props.game.video && 
                            <div className="menu-game-video">
                                <h2 className="menu-game-video-header">{props.game.video.name}:</h2>
                                <iframe className="menu-game-video-feed" height="400px" frameBorder="0" allowFullScreen={true} src={props.game.video.youtube_link} />
                            </div>}
                        {props.game.screenshots && 
                            <div className="menu-game-screenshots">
                                <h2 className="menu-game-screenshots-header">Screenshots:</h2>
                                <Slideshow images={props.game.screenshots}/>
                            </div>}
                        {props.game.reviews && 
                            <div className="menu-game-reviews">
                                <h2 className="menu-game-reviews-header">Reviews:</h2>
                                <RaisedButton className="menu-game-reviews-btn" onClick={() => { props.handleReadReviewsClick(); }}>
                                    {props.reviewsExpanded ? "Collapse reviews" : "Read reviews"}
                                    {props.reviewsExpanded ? <i className="fas fa-chevron-circle-up"/> : <i className="fas fa-chevron-circle-down"/>}
                                </RaisedButton>
                                {props.reviewsExpanded && 
                                    <div className="menu-game-reviews-padding">
                                        {props.game.reviews.map((review: SteamAPIReview, index: number) => {
                                            return (
                                                <div key={index} className="menu-game-reviews-container">
                                                    <div className="menu-game-review-header-container">
                                                        <div className="menu-game-review-header">
                                                            <div className="menu-game-review-header-hoursplayed">
                                                                <i className="far fa-clock icon-hoursplayed"/>
                                                                {review.hours_played} hours played
                                                            </div>
                                                            <div className="menu-game-review-header-upvotes">
                                                                {review.up_votes}
                                                                <i className="far fa-thumbs-up icon-upvotes"/>
                                                            </div>
                                                            <div className="border-bottom"/>
                                                        </div>
                                                    </div>
                                                    <div className="menu-game-review-body-container">
                                                        {review.text}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>}
                                
                            </div>}
                </div>
                }
        </div>
    );

};

export default Game;