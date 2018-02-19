const popupS = require('popups');
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import Slideshow from './slideshow';
import { ResponseModel, GameResponse } from '../../../../client/client-server-common/common';

interface IGameProps {
    history: any;

    gameId: string;
}

class Game extends React.Component<IGameProps, any> {

    constructor(props: IGameProps) {
        super(props);
        this.state = {};
        this.loadGame = this.loadGame.bind(this);
        console.log(`Passed game #${this.props.gameId}`);
        // load game
        if (this.props.gameId) {
            this.state = { isLoading: true };
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
            .then( (response: GameResponse) => {
                this.setState({ isLoading: false, game: response });
            })
            .catch( (response: any) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div > • ${errorMsg}</div > `; });
                popupS.modal({ content: formattedErrors.join('') });
            });
    }

    render() {
        const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

        if (this.state.isLoading) {
            return (
                <div className="menu-center">
                    <Spinner loadingMsg="Loading game..." />
                </div>
            );
        }
        
        if (!this.props.gameId) {
            console.log(`RENDERING START!`);
            return (
                <div className="menu-choose-game">
                    <i className="fas fa-arrow-right fa-6x menu-choose-game-arrow" data-fa-transform="rotate-270"/>
                    <strong className="menu-choose-game-text">Search a Game</strong>
                </div>
            );
        }
        console.log(`RENDERING GAME!`);
        return (
            <div>
                {this.props.gameId && 
                    <div className="menu-game">
                        {this.state.game.cover && 
                            <img className="menu-game-cover" height={deviceWidth * 1.25} width={deviceWidth} src={this.state.game.cover} alt="Game cover"/>}
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
                                <span className="menu-game-rating-count">({this.state.game.rating_count} reviews)</span>}
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
                                                <li key={x}>{x} <i className="menu-game-platforms-releasedate">({this.state.game.platforms_release_dates[index]})</i></li>
                                            );
                                        })}
                                    </ul>
                                </div>}
                            {this.state.game.genres && 
                                <div className="menu-game-genres">
                                    <h2 className="menu-game-genres-header">Genres: </h2>
                                    <i>{this.state.game.genres.join(', ')}</i>
                                </div>}
                            {this.state.game.summary && 
                                <div className="menu-game-summary">
                                    <h2>Summary:</h2>
                                    <div className="menu-game-summary-text">{this.state.game.summary}</div>
                                </div>}
                            {this.state.game.screenshots && 
                                <div className="menu-game-screenshots">
                                    <h2 className="menu-game-screenshots-header">Screenshots:</h2>
                                    <Slideshow images={this.state.game.screenshots}/>
                                </div>}
                    </div>
                    }
            </div>
        );

    }

}

export default withRouter(Game);