import * as React from 'react';
import Spinner from '../../../spinner/main';
import { GameResponse, getCachedIGDBImage, IGDBImageSizeEnums, getIGDBImage, PriceInfo, IGDBExternalCategoryEnum, PricingsEnum } from '../../../../../client/client-server-common/common';
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
import SimilarGames from './SimilarGames';

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
    onNotificationsClick: () => void;
    onPricingClick: (externalCategoryEnum: IGDBExternalCategoryEnum) => void;
}

const Game: React.SFC<IGameProps> = (props: IGameProps) => {
    
    if (props.isLoading) {
        return (
            <div className="menu-center">
                <Spinner className="text-center mt-5" loadingMsg="Loading game..." />
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
    
    let steamPricings: PriceInfo[] = props.game.pricings.filter((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.steam);
    let steamMainGame: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => (priceInfo.external_category_enum === IGDBExternalCategoryEnum.steam) && priceInfo.pricings_enum === PricingsEnum.main_game);
    let steamIsFree: boolean = steamMainGame && !steamMainGame.price;
    let steamIsDiscounted: boolean = steamMainGame && steamMainGame.price && !!steamMainGame.discount_percent;
    let steamBasePrice: number = steamIsDiscounted && + (steamMainGame.price / ((100 - steamMainGame.discount_percent) / 100)).toFixed(2);

    let gogPricings: PriceInfo[] = props.game.pricings.filter((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.gog);
    let gogMainGame: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => (priceInfo.external_category_enum === IGDBExternalCategoryEnum.gog) && priceInfo.pricings_enum === PricingsEnum.main_game);
    let gogIsFree: boolean = gogMainGame && !gogMainGame.price;
    let gogIsDiscounted: boolean = gogMainGame && gogMainGame.price && !!gogMainGame.discount_percent;
    let gogBasePrice: number = gogIsDiscounted && + (gogMainGame.price / ((100 - gogMainGame.discount_percent) / 100)).toFixed(2);

    let microsoftPricings: PriceInfo[] = props.game.pricings.filter((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.microsoft);
    let microsoftMainGame: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => (priceInfo.external_category_enum === IGDBExternalCategoryEnum.microsoft) && priceInfo.pricings_enum === PricingsEnum.main_game);
    let microsoftIsFree: boolean = microsoftMainGame && !microsoftMainGame.price;
    let microsoftIsDiscounted: boolean = microsoftMainGame && microsoftMainGame.price && !!microsoftMainGame.discount_percent;
    let microsoftBasePrice: number = microsoftIsDiscounted && + (microsoftMainGame.price / ((100 - microsoftMainGame.discount_percent) / 100)).toFixed(2);

    let applePricings: PriceInfo[] = props.game.pricings.filter((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.apple);
    let appleMainGame: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => (priceInfo.external_category_enum === IGDBExternalCategoryEnum.apple) && priceInfo.pricings_enum === PricingsEnum.main_game);
    let appleIsFree: boolean = appleMainGame && !appleMainGame.price;
    let appleIsDiscounted: boolean = appleMainGame && appleMainGame.price && !!appleMainGame.discount_percent;
    let appleBasePrice: number = appleIsDiscounted && + (appleMainGame.price / ((100 - appleMainGame.discount_percent) / 100)).toFixed(2);

    let androidPricings: PriceInfo[] = props.game.pricings.filter((priceInfo: PriceInfo) => priceInfo.external_category_enum === IGDBExternalCategoryEnum.android);
    let androidMainGame: PriceInfo = props.game.pricings.find((priceInfo: PriceInfo) => (priceInfo.external_category_enum === IGDBExternalCategoryEnum.android) && priceInfo.pricings_enum === PricingsEnum.main_game);
    let androidIsFree: boolean = androidMainGame && !androidMainGame.price;
    let androidIsDiscounted: boolean = androidMainGame && androidMainGame.price && !!androidMainGame.discount_percent;
    let androidBasePrice: number = androidIsDiscounted && + (androidMainGame.price / ((100 - androidMainGame.discount_percent) / 100)).toFixed(2);

    const maxWidth: number = 250;
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
            {(props.game.screenshots.length > 0 || props.game.video_cached) &&
                <Background
                    gameId={props.gameId}
                    screenshots={props.game.screenshots}
                    videoCached={props.game.video_cached}
                    imageCached={props.game.image_cached}
                />}
            <div className="position-relative mx-5" style={getCoverContainerStyle()}>
                <div className="d-inline-block" style={getCoverGameInfoStyle()}>
                    {props.game.cover &&
                        <Cover
                            url={props.game.image_cached ? getCachedIGDBImage(props.game.cover.image_id, IGDBImageSizeEnums.cover_big) : getIGDBImage(props.game.cover.image_id, IGDBImageSizeEnums.cover_big)}
                            style={getCoverImgStyle()}
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
                                externalCategoryEnum={IGDBExternalCategoryEnum.steam}
                                onPricingClick={props.onPricingClick}
                            />}
                        {gogMainGame && 
                            <Pricing
                                pricings={gogPricings}
                                isFree={gogIsFree}
                                isDiscounted={gogIsDiscounted}
                                basePrice={gogBasePrice}
                                externalCategoryEnum={IGDBExternalCategoryEnum.gog}
                                onPricingClick={props.onPricingClick}
                            />}
                        {microsoftMainGame && 
                            <Pricing
                                pricings={microsoftPricings}
                                isFree={microsoftIsFree}
                                isDiscounted={microsoftIsDiscounted}
                                basePrice={microsoftBasePrice}
                                externalCategoryEnum={IGDBExternalCategoryEnum.microsoft}
                                onPricingClick={props.onPricingClick}
                            />}
                        {appleMainGame && 
                            <Pricing
                                pricings={applePricings}
                                isFree={appleIsFree}
                                isDiscounted={appleIsDiscounted}
                                basePrice={appleBasePrice}
                                externalCategoryEnum={IGDBExternalCategoryEnum.apple}
                                onPricingClick={props.onPricingClick}
                            />}
                        {androidMainGame && 
                            <Pricing
                                pricings={androidPricings}
                                isFree={androidIsFree}
                                isDiscounted={androidIsDiscounted}
                                basePrice={androidBasePrice}
                                externalCategoryEnum={IGDBExternalCategoryEnum.android}
                                onPricingClick={props.onPricingClick}
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
                        {props.game.multi_enabled && 
                            <div className="multiplayer text-center mt-3">
                                <i className="fas fa-users mr-2"/>
                                Online Multiplayer
                            </div>}
                    </div>
                </div>
                <div className="d-inline-block align-top pl-4 h-100 w-md-100" style={getCoverTitleContainerStyle()}>
                    <Title
                        name={props.game.name}
                        rating={props.game.aggregated_rating}
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
                            imageCached={props.game.image_cached}
                        />
                    </div>
                </div>
                <SimilarGames
                    similarGames={props.game.similar_games}
                    goToGame={props.goToGame}
                    onSimilarGamesMouseDown={props.onSimilarGamesMouseDown}
                    onSimilarGamesMouseUp={props.onSimilarGamesMouseUp}
                    onSimilarGamesMouseMove={props.onSimilarGamesMouseMove}
                />
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
