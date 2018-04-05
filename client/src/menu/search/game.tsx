const popupS = require('popups');
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import Slideshow from './slideshow';
import { SingleGameResponse, SteamAPIReview } from '../../../../client/client-server-common/common';
import RaisedButton from 'material-ui/RaisedButton';
import Truncate from 'react-truncate';

interface IGameProps {
    gameId: string;
    history: any;
}

class Game extends React.Component<IGameProps, any> {

    constructor(props: IGameProps) {
        super(props);
        this.state = {};
        this.loadGame = this.loadGame.bind(this);
        
        // load game
        if (this.props.gameId) {
            this.state = { isLoading: true, summaryExpanded: false, reviewsExpanded: false };
            this.loadGame(this.props.gameId);
        }
    }

    public componentWillReceiveProps(newProps: IGameProps) {
        // load new game
        if (newProps.gameId && this.props.gameId !== newProps.gameId) {
            this.setState({ isLoading: true });
            this.loadGame(newProps.gameId);
        }
    }

    private loadGame(id: string): void {
        IGDBService.httpGetGame(id)
            .then( (response: SingleGameResponse) => {
                this.setState({ isLoading: false, game: response.data });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
    }

    private handlePlatformClick(index: number): void {
        this.props.history.push(`/menu/platform/${this.state.game.platform_ids[index]}`);
    }
    
    private handleGenreClick(index: number): void {
        this.props.history.push(`/menu/genre/${this.state.game.genre_ids[index]}`);
    }

    private handleReadReviewsClick(): void {
        this.setState({ reviewsExpanded: !this.state.reviewsExpanded });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="menu-center">
                    <Spinner loadingMsg="Loading game..." />
                </div>
            );
        }
        
        if (!this.props.gameId) {
            return (
                <div className="menu-choose-game">
                    <i className="fas fa-arrow-right fa-6x menu-choose-game-arrow" data-fa-transform="rotate-270"/>
                    <strong className="menu-choose-game-text">Search a Game</strong>
                </div>
            );
        }
        return (
            <div>
                {this.props.gameId && 
                    <div className="menu-game">
                        {this.state.game.cover && 
                            <img className="menu-game-cover" width="100%" src={this.state.game.cover} alt="Game cover"/>}
                        <h1 className="menu-game-name">{this.state.game.name}</h1>
                        {this.state.game.rating && 
                            <span className="menu-game-rating-stars">
                                {this.state.game.rating > 0
                                    ? this.state.game.rating <= 10 
                                        ? <i className="fas fa-star-half fa-2x"/> 
                                        : <i className="fas fa-star fa-2x"/>
                                    : this.state.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                                {this.state.game.rating > 20
                                    ? this.state.game.rating <= 30 
                                        ? <i className="fas fa-star-half fa-2x"/> 
                                        : <i className="fas fa-star fa-2x"/>
                                    : this.state.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                                {this.state.game.rating > 40
                                    ? this.state.game.rating <= 50 
                                        ? <i className="fas fa-star-half fa-2x"/> 
                                        : <i className="fas fa-star fa-2x"/>
                                    : this.state.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                                {this.state.game.rating > 60
                                    ? this.state.game.rating <= 70 
                                        ? <i className="fas fa-star-half fa-2x"/> 
                                        : <i className="fas fa-star fa-2x"/>
                                    : this.state.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                                {this.state.game.rating > 80
                                    ? this.state.game.rating <= 90 
                                        ? <i className="fas fa-star-half fa-2x"/> 
                                        : <i className="fas fa-star fa-2x"/>
                                    : this.state.game.rating === -1 && <i className="far fa-star fa-2x"/>}
                            </span>}
                            {this.state.game.rating_count !== undefined && 
                                <span className="menu-game-rating-count">({this.state.game.rating_count} ratings)</span>}
                            {this.state.game.price && 
                                <div className="menu-game-price">
                                    <h2 className="menu-game-price-header">Price: </h2>
                                    {this.state.game.price === 'Free'
                                    ? <strong>Free</strong>
                                    : <i>${this.state.game.price} USD {this.state.game.discount_percent !== 0 && '(-' + this.state.game.discount_percent + '% SALE)'}</i>}
                                    <a href={this.state.game.steam_url} className="menu-game-releasedate-icon"><i className="fab fa-steam-square fa-2x"/></a>
                                </div>}
                            <div className="menu-game-releasedate">
                                <h2 className="menu-game-releasedate-header">Next release: </h2>
                                <i>{this.state.game.next_release_date ? this.state.game.next_release_date : 'No planned releases'}</i>
                            </div>
                            {this.state.game.platforms && 
                                <div className="menu-game-platforms">
                                    <h2 className="menu-game-platforms-header">Platforms: </h2>
                                    <ul>
                                    {this.state.game.platforms
                                        .map((x: string, index: number) => {
                                            return (
                                                <li key={x}><div className="menu-game-platforms-name-container"><RaisedButton className="menu-game-platforms-name" label={x} onClick={() => { this.handlePlatformClick(index); }}/></div><i className="menu-game-platforms-releasedate">({this.state.game.platforms_release_dates[index] !== `undefined. NaN, NaN` ? this.state.game.platforms_release_dates[index] : `N/A`})</i></li>
                                            );
                                        })}
                                    </ul>
                                </div>}
                            {this.state.game.genres && 
                                <div className="menu-game-genres">
                                    <h2 className="menu-game-genres-header">Genres: </h2>
                                    {this.state.game.genres
                                        .map((x: string, index: number) => {
                                            return (
                                                <span key={x}><RaisedButton className="menu-game-genres-name" label={x} onClick={() => { this.handleGenreClick(index); }}/>{index !== (this.state.game.genres.length - 1) && ` , `}</span>
                                            );
                                        })}
                                </div>}
                            {this.state.game.summary && 
                                <div className="menu-game-summary">
                                    <h2>Summary:</h2>
                                    <div className="menu-game-summary-text">
                                        {!this.state.summaryExpanded
                                        ? <Truncate lines={5} ellipsis={<i onClick={() => { this.setState({ summaryExpanded: true }); }}> ... Read more</i>}>{this.state.game.summary}</Truncate>
                                        : this.state.game.summary}
                                    </div>
                                </div>}
                            {this.state.game.video && 
                                <div className="menu-game-video">
                                    <h2 className="menu-game-video-header">{this.state.game.video.name}:</h2>
                                    <iframe width="100%" height="400px" frameBorder="0" allowFullScreen={true} src={this.state.game.video.youtube_link} />
                                </div>}
                            {this.state.game.screenshots && 
                                <div className="menu-game-screenshots">
                                    <h2 className="menu-game-screenshots-header">Screenshots:</h2>
                                    <Slideshow images={this.state.game.screenshots}/>
                                </div>}
                            {this.state.game.reviews && 
                                <div className="menu-game-reviews">
                                    <h2 className="menu-game-reviews-header">Reviews:</h2>
                                    <RaisedButton className="menu-game-reviews-btn" onClick={() => { this.handleReadReviewsClick(); }}>
                                        {this.state.reviewsExpanded ? "Collapse reviews" : "Read reviews"}
                                        {this.state.reviewsExpanded ? <i className="fas fa-chevron-circle-up"/> : <i className="fas fa-chevron-circle-down"/>}
                                    </RaisedButton>
                                    {this.state.reviewsExpanded && 
                                        <div className="menu-game-reviews-padding">
                                            {this.state.game.reviews.map((review: SteamAPIReview, index: number) => {
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

    }

}

export default withRouter(Game);