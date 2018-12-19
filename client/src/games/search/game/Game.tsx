import * as React from 'react';
import Spinner from '../../../spinner/main';
import { GameResponse } from '../../../../../client/client-server-common/common';
import Summary from './Summary';
import Platforms from './Platforms';
import Genres from './Genres';
import Media from './Media';
import { Paper } from '@material-ui/core';
import Title from './Title';
import SteamInfo from './SteamInfo';
import Cover from './Cover';

interface IGameProps {
    isLoading: boolean;
    gameId: number;
    game: GameResponse;
    summaryExpanded: boolean;
    reviewsExpanded: boolean;
    handleSteamClick: (url: string) => void;
    handlePlatformClick: (index: number) => void;
    handleGenreClick: (index: number) => void;
    handleReadReviewsClick: () => void;
    expandSummary: () => void;
}

const Game: React.SFC<IGameProps> = (props: IGameProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-center">
                <Spinner className="text-center mt-5" loadingMsg="Loading game..." />
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
        <Paper className="game-details container bg-secondary mx-auto p-3 mt-3 br-0" elevation={24}>
            <Title
                name={props.game.name}
                rating={props.game.rating}
            />
            <div className="row">
                <Media
                    video={props.game.video && props.game.video.youtube_link}
                    screenshots={props.game.screenshots}
                />
                <div className="cover-container col-lg-4">
                    <div className="general-info">
                        <Cover
                            cover={props.game.cover}
                            screenshots={props.game.screenshots}
                        />
                        <Summary
                            summary={props.game.summary}
                            summaryExpanded={props.summaryExpanded}
                            expandSummary={props.expandSummary}
                        />
                        <Genres 
                            genres={props.game.genres}
                            handleGenreClick={props.handleGenreClick}
                        />
                        <Platforms
                            platforms={props.game.platforms}
                            platforms_release_dates={props.game.platforms_release_dates}
                            handlePlatformClick={props.handlePlatformClick}
                        />
                    </div>
                    {props.game.steam_url && 
                        <SteamInfo
                            steam_url={props.game.steam_url}
                            price={props.game.price}
                            discount_percent={props.game.discount_percent}
                            handleSteamClick={props.handleSteamClick}
                        />}
                </div>
            </div>
        </Paper>
    );

};

export default Game;