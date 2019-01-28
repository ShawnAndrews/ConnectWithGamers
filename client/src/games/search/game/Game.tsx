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
import Background from './Background';
import Snackbar from '@material-ui/core/Snackbar';

interface IGameProps {
    isLoading: boolean;
    gameId: number;
    game: GameResponse;
    summaryExpanded: boolean;
    gameRatedSnackbarOpen: boolean;
    handleSteamClick: (url: string) => void;
    handlePlatformClick: (index: number) => void;
    handleGenreClick: (index: number) => void;
    expandSummary: () => void;
    onRateStarsClick: (rating: number) => void;
    gameRatedSnackbarClose: () => void;
    mediaCarouselElement: any; 
}

const Game: React.SFC<IGameProps> = (props: IGameProps) => {

    if (props.isLoading || !props.game) {
        return (
            <div className="menu-center">
                <Spinner className="text-center mt-5" loadingMsg="Loading game..." />
            </div>
        );
    }

    const horizontalImage: boolean = props.game.cover && (props.game.cover.width > props.game.cover.height);
    const maxWidth: number = horizontalImage ? 300 : 250;
    const aspectRatio: number = props.game.cover && (maxWidth / props.game.cover.width);
    const newWidth: number = props.game.cover && (aspectRatio * props.game.cover.width);
    const newHeight: number = props.game.cover && (aspectRatio * props.game.cover.height);
    const titleHeight: number = 60;
    const starsHeight: number = 25;

    const getCoverContainerStyle = (): Object => {

        if (!props.game.screenshots) {
            return {};
        }

        return {
            marginTop: `-${newHeight * 0.7}px`,
        };
    }

    const getCoverImgStyle = (): Object => {

        return {
            width: `${newWidth}px`,
            height: `${newHeight}px`
        };
    }

    const getCoverTitleContainerStyle = (): Object => {

        return {
            width: `calc(100% - ${newWidth}px)`
        };
    }

    const getCoverInfoStyle = (): Object => {

        return {
            background: `linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 76%,rgba(0,0,0,0.0) 100%)`,
        };
    }

    const getCoverNameStyle = (): Object => {

        return {
            height: `${titleHeight}px`,
            color: `rgba(255,255,255,0.8)`
        };
    }

    const getCoverContentStyle = (): Object => {

        if (!props.game.screenshots) {
            return {};
        }

        return {
            marginTop: `calc(${newHeight * 0.7}px ${props.game.aggregated_rating ? ` - ${starsHeight}px` : ''})`
        };
    }

    const getCoverGameInfoStyle = (): Object => {

        return {
            width: `${newWidth}px`
        };
    }

    return (
        <Paper className="game-details bg-primary-solid overflow-hidden position-relative p-0 br-0" elevation={24}>
            {props.game.screenshots &&
                <Background
                    screenshots={props.game.screenshots}
                />}
            <div className="position-relative mx-5" style={getCoverContainerStyle()}>
                <div className="d-inline-block" style={getCoverGameInfoStyle()}>
                    {props.game.cover &&
                        <Cover
                            url={props.game.cover.url}
                            discount_percent={props.game.external.steam && props.game.external.steam.discount_percent}
                            style={getCoverImgStyle()}
                        />}
                    <div className="game-info my-2">
                        {props.game.external.steam && 
                            <SteamInfo
                                steam={`${props.game.external.steam.url}`}
                                price={props.game.external.steam.price}
                                discount_percent={props.game.external.steam.discount_percent}
                                handleSteamClick={props.handleSteamClick}
                            />}
                        {props.game.platforms && 
                            <Platforms
                                platforms={props.game.platforms}
                                release_dates={props.game.release_dates}
                                handlePlatformClick={props.handlePlatformClick}
                            />}
                        {props.game.genres && 
                            <Genres 
                                genres={props.game.genres}
                                handleGenreClick={props.handleGenreClick}
                            />}
                    </div>
                </div>
                <div className="d-inline-block align-top pl-4 h-100 w-md-100" style={getCoverTitleContainerStyle()}>
                    <Title
                        name={props.game.name}
                        rating={props.game.aggregated_rating}
                        onRateStarsClick={props.onRateStarsClick}
                        gameRatedSnackbarOpen={props.gameRatedSnackbarOpen}
                        containerStyle={getCoverInfoStyle()}
                        nameStyle={getCoverNameStyle()}
                    />
                    <div style={getCoverContentStyle()}>
                        <div className="row color-secondary pl-3">
                            {props.game.summary && 
                                <Summary
                                    summary={props.game.summary}
                                    summaryExpanded={props.summaryExpanded}
                                    expandSummary={props.expandSummary}
                                />}
                        </div>
                        <Media
                            video={props.game.video}
                            screenshots={props.game.screenshots}
                            mediaCarouselElement={props.mediaCarouselElement}
                        />
                    </div>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={props.gameRatedSnackbarOpen}
                onClose={props.gameRatedSnackbarClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Game rated!</span>}
            />
        </Paper>
    );

};

export default Game;