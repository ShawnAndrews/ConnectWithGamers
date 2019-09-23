import * as React from 'react';
import Spinner from '../../../spinner/main';
import { GameResponse, PricingsEnum, GameModesEnum, PriceInfoResponse } from '../../../../../client/client-server-common/common';
import Summary from './Summary';
import Platforms from './Platforms';
import Genres from './Genres';
import Media from './Media';
import { Paper, Button } from '@material-ui/core';
import Title from './Title';
import Pricing from './Pricing';
import Cover from './Cover';
import Background from './Background';
import Snackbar from '@material-ui/core/Snackbar';
import SimilarGamesContainer from './SimilarGamesContainer';
import ReleaseDate from './ReleaseDate';

interface IGameProps {
    isLoading: boolean;
    gameId: number;
    game: GameResponse;
    summaryExpanded: boolean;
    gameRatedSnackbarOpen: boolean;
    notifcationsEnabled: boolean;
    handleSteamClick: (url: string) => void;
    handlePlatformClick: (index: number) => void;
    handleGenreClick: (index: number) => void;
    expandSummary: () => void;
    onRateStarsClick: (rating: number) => void;
    gameRatedSnackbarClose: () => void;
    mediaCarouselElement: any;
    goToGame: (id: number) => void;
    onSimilarGamesMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
    onSimilarGamesMouseOver: (index: number) => void;
    onSimilarGamesMouseLeave: () => void;
    onNotificationsClick: () => void;
    onPricingClick: () => void;
    hoveredSimilarGameIndex: number;
    getConvertedPrice: (price: number, skipCurrencyType: boolean) => string;
}

const Game: React.SFC<IGameProps> = (props: IGameProps) => {
    
    if (props.isLoading) {
        return (
            <div className="menu-center">
                <Spinner className="text-center mt-5 pt-5" loadingMsg="Loading game..." />
            </div>
        );
    }
    
    if (!props.game) {
        return (
            <div className="text-center color-tertiary display-4">
                Invalid game id
            </div>
        );
    }
    
    let steamPricings: PriceInfoResponse[] = props.game.pricings;
    let steamMainGame: PriceInfoResponse = props.game.pricings && props.game.pricings.find((priceInfo: PriceInfoResponse) => priceInfo.pricingEnumSysKeyId === PricingsEnum.main_game);
    let steamIsFree: boolean = steamMainGame && !steamMainGame.price;
    let steamIsDiscounted: boolean = steamMainGame && steamMainGame.price && !!steamMainGame.discount_percent;
    let steamBasePrice: number = steamIsDiscounted && + (steamMainGame.price / ((100 - steamMainGame.discount_percent) / 100)).toFixed(2);

    const newWidth: number = props.game.cover && 200; // (aspectRatio * props.game.cover.width);
    const newHeight: number = props.game.cover && 400; // (aspectRatio * props.game.cover.height);
    const titleHeight: number = 60;
    const starsHeight: number = 25;

    const getCoverContainerStyle = (): Object => {

        if (!props.game.screenshots) {
            return {};
        }

        return {
            marginTop: `-180px`,
        };
    }

    const getCoverTitleContainerStyle = (): Object => {

        return {
            width: `calc(100% - 460px)`
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
            marginTop: `175px`
        };
    }

    const getCoverGameInfoStyle = (): Object => {

        return {
            width: `460px`
        };
    }

    return (
        <Paper className="game-details bg-primary-solid overflow-hidden position-relative p-0 br-0" elevation={24}>
            {(props.game.screenshots.length > 0) &&
                <Background
                    gameId={props.gameId}
                    screenshots={props.game.screenshots}
                    video={props.game.video}
                />}
            <div className="position-relative mx-5 mb-2" style={getCoverContainerStyle()}>
                <div className="d-inline-block" style={getCoverGameInfoStyle()}>
                    {props.game.cover &&
                        <Cover
                            url={props.game.cover}
                        />}
                    <div className="game-info">
                        <Button className={`game-notifications-btn ${props.notifcationsEnabled ? `enabled` : `disabled`} mt-2 mb-5`} onClick={props.onNotificationsClick} variant="contained" fullWidth={true}>
                            {props.notifcationsEnabled
                                ?
                                <>
                                    <i className="fas fa-bell-slash mr-2"/>
                                    Disable notifcations
                                </>
                                :
                                <>
                                    <i className="fas fa-bell mr-2"/>
                                    Enable notifcations
                                </>}
                        </Button>
                        {steamMainGame && 
                            <Pricing
                                pricings={steamPricings}
                                isFree={steamIsFree}
                                isDiscounted={steamIsDiscounted}
                                basePrice={steamBasePrice}
                                onPricingClick={props.onPricingClick}
                                getConvertedPrice={props.getConvertedPrice}
                            />}
                        {/* {props.game.platforms && 
                            <Platforms
                                platforms={props.game.platforms}
                                handlePlatformClick={props.handlePlatformClick}
                            />} */}
                        {props.game.genres && 
                            <Genres 
                                genres={props.game.genres}
                                handleGenreClick={props.handleGenreClick}
                            />}
                        {props.game.first_release_date && 
                            <ReleaseDate 
                                firstReleaseDate={new Date(props.game.first_release_date).getTime()}
                            />}
                        {/* {props.game.game_modes && 
                            props.game.game_modes.map((mode: number) => (
                                <div className="game_mode text-center mt-3">
                                    {mode === 1 && <i className="fas fa-user mr-2"/>}
                                    {mode === 2 && <i className="fas fa-users mr-2"/>}
                                    {mode === 3 && <i className="fas fa-users mr-2"/>}
                                    {mode === 4 && <i className="fas fa-desktop mr-2"/>}
                                    {mode === 5 && <i className="fas fa-users mr-2"/>}
                                    {GameModesEnum[mode]}
                                </div>
                            ))} */}
                    </div>
                </div>
                <div className="d-inline-block align-top pl-4 h-100 w-md-100" style={getCoverTitleContainerStyle()}>
                    <Title
                        name={props.game.name}
                        rating={props.game.review.id}
                        onRateStarsClick={props.onRateStarsClick}
                        gameRatedSnackbarOpen={props.gameRatedSnackbarOpen}
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
                {/* {props.game.similar_games && 
                    <SimilarGamesContainer
                        similarGames={props.game.similar_games}
                        hoveredSimilarGameIndex={props.hoveredSimilarGameIndex}
                        goToGame={props.goToGame}
                        onSimilarGamesMouseDown={props.onSimilarGamesMouseDown}
                        onSimilarGamesMouseUp={props.onSimilarGamesMouseUp}
                        onSimilarGamesMouseMove={props.onSimilarGamesMouseMove}
                        onSimilarGamesMouseOver={props.onSimilarGamesMouseOver}
                        onSimilarGamesMouseLeave={props.onSimilarGamesMouseLeave}
                        getConvertedPrice={props.getConvertedPrice}
                    />} */}
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
