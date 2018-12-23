import * as React from 'react';
import Spinner from '../../../spinner/main';
import { GameResponse, steamAppUrl } from '../../../../../client/client-server-common/common';
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

    if (props.isLoading || !props.game) {
        return (
            <div className="menu-center">
                <Spinner className="text-center mt-5" loadingMsg="Loading game..." />
            </div>
        );
    }
    
    return (
        <Paper className="game-details container bg-secondary mx-auto p-3 mt-3 br-0" elevation={24}>
            <Title
                name={props.game.name}
                rating={props.game.aggregated_rating}
            />
            <div className="row">
                <Media
                    video={props.game.video}
                    screenshots={props.game.screenshots}
                />
                <div className={`cover-container ${props.game.screenshots || props.game.video ? 'col-lg-4' : 'col-lg-12'}`}>
                    <div className={`general-info ${!props.game.screenshots && !props.game.video && 'text-center'}`}>
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
                            release_dates={props.game.release_dates}
                            handlePlatformClick={props.handlePlatformClick}
                        />
                    </div>
                    {props.game.steamid && 
                        <SteamInfo
                            steam_url={`${steamAppUrl}/${props.game.steamid}`}
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