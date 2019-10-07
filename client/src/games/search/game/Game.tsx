import * as React from 'react';
import Spinner from '../../../spinner/main';
import { GameResponse, PricingsEnum, PriceInfoResponse, StateEnum, IdNamePair, PlatformEnum, Review } from '../../../../../client/client-server-common/common';
import Genres from './Genres';
import Media from './Media';
import { Paper, Button, Stepper, Step, Typography, StepLabel, AppBar, Tabs, Tab } from '@material-ui/core';
import Title from './Title';
import Pricing from './Pricing';
import Cover from './Cover';
import Background from './Background';
import Snackbar from '@material-ui/core/Snackbar';
import Features from './features';
import Reviews from './Reviews';
import SimilarGames from './SimilarGames';
import Achievements from './Achievements';
import PriceHistory from './PriceHistory';

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
    handleFeaturesClick: (index: number) => void;
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
    containerValue: number;
    handleContainerChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
    reviews: Review[];
    handleReviewClick: (index: number) => void;
    reviewsCollapsed: boolean[];
    similar_games: GameResponse[];
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
    let pricingsExist: boolean = props.game.pricings.length > 0;
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

    const getCoverGameInfoStyle = (): Object => {

        return {
            width: `460px`
        };
    }

    interface TabPanelProps {
        children?: React.ReactNode;
        index: any;
        value: any;
    }

    function TabPanel(tabProps: TabPanelProps) {
        const { children, value, index, ...other } = tabProps;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-force-tabpanel-${index}`}
                aria-labelledby={`scrollable-force-tab-${index}`}
                {...other}
            >
                <div>{children}</div>
            </Typography>
        );
    }

    function a11yProps(index: any) {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
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
                            steamId={props.game.steamId}
                            url={props.game.cover}
                        />}
                    <div className="game-info">
                        <Button className={`game-notifications-btn ${props.notifcationsEnabled ? `enabled` : `disabled`} mt-2 mb-4`} onClick={props.onNotificationsClick} variant="contained" fullWidth={true}>
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
                        {pricingsExist && 
                            <Pricing
                                pricings={steamPricings}
                                isDiscounted={steamIsDiscounted}
                                basePrice={steamBasePrice}
                                onPricingClick={props.onPricingClick}
                                getConvertedPrice={props.getConvertedPrice}
                                review={props.game.review}
                                total_review_count={props.game.total_review_count}
                            />}
                        {props.game.genres && props.game.genres.length > 0 && 
                            <Genres 
                                genres={props.game.genres}
                                handleGenreClick={props.handleGenreClick}
                            />}
                        {props.game.game_modes && props.game.game_modes.length > 0 && 
                            <Features 
                                features={props.game.game_modes}
                                handleFeaturesClick={props.handleFeaturesClick}
                            />}
                        <div className="platforms">
                            {props.game.platforms && 
                                props.game.platforms.map((pair: IdNamePair) => {
                                    if (pair.id === PlatformEnum.linux) {
                                        return <i className="fab fa-linux mr-2"/>;
                                    } else if (pair.id === PlatformEnum.mac) {
                                        return <i className="fab fa-apple mr-2"/>;
                                    } else if (pair.id === PlatformEnum.windows) {
                                        return <i className="fab fa-windows mr-2"/>;
                                    }
                                })}
                        </div>
                    </div>
                </div>
                <div className="d-inline-block align-top pl-4 h-100 w-md-100" style={getCoverTitleContainerStyle()}>
                    <Title
                        name={props.game.name}
                        rating={props.game.review.id}
                        onRateStarsClick={props.onRateStarsClick}
                        gameRatedSnackbarOpen={props.gameRatedSnackbarOpen}
                        nameStyle={getCoverNameStyle()}
                        developer={props.game.developer}
                        publisher={props.game.publisher}
                    />
                    <div className="state-stepper mt-4">
                        <Stepper activeStep={(Object.keys(StateEnum).length / 2) - props.game.state.id + 1}>
                            {Object.keys(StateEnum).filter(value => isNaN(Number(value))).map((label: string, index: number) => 
                                {
                                    const stepProps: any = {};
                                    const labelProps: any = {};
                                    if (index == 1) {
                                        labelProps.optional = <Typography variant="caption">{new Date(props.game.first_release_date).toLocaleDateString()}</Typography>;
                                    }
                                    if (index == 2 || index == 3) {
                                        labelProps.optional = <Typography className="optional-text" variant="caption">Optional</Typography>;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    );
                                })
                            }
                        </Stepper>
                    </div>
                    <div className="row color-secondary pl-3 m-0">
                        <div className="container mb-4">
                            <AppBar position="static" color="default">
                                <Tabs
                                value={props.containerValue}
                                onChange={props.handleContainerChange}
                                variant="scrollable"
                                scrollButtons="on"
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="scrollable force tabs example"
                                >
                                    <Tab label="Summary" icon={<i className="far fa-file-alt"/>} {...a11yProps(0)} />
                                    <Tab label="Price history" icon={<i className="fas fa-money-bill-wave"/>} {...a11yProps(1)} />
                                    <Tab label="Achievements" icon={<i className="fas fa-trophy"/>} {...a11yProps(2)} />
                                    <Tab label="Similar games" icon={<i className="fab fa-steam-symbol"/>} {...a11yProps(3)} />
                                    <Tab label="Reviews" icon={<i className="far fa-comment"/>} {...a11yProps(4)} />
                                </Tabs>
                            </AppBar>
                            <TabPanel value={props.containerValue} index={0}>
                                {props.game.summary && 
                                    <div className="summary mb-4" dangerouslySetInnerHTML={{ __html: props.game.summary }} />}
                            </TabPanel>
                            <TabPanel value={props.containerValue} index={1}>
                                <PriceHistory pricings={props.game.pricings} />
                            </TabPanel>
                            <TabPanel value={props.containerValue} index={2}>
                                <Achievements achievements={props.game.achievements} />
                            </TabPanel>
                            <TabPanel value={props.containerValue} index={3}>
                                <SimilarGames similar_games={props.similar_games} goToGame={props.goToGame}/>
                            </TabPanel>
                            <TabPanel value={props.containerValue} index={4}>
                                <Reviews reviews={props.reviews} handleReviewClick={props.handleReviewClick} reviewsCollapsed={props.reviewsCollapsed}/>
                            </TabPanel>
                        </div>
                    </div>
                </div>
                <Media
                    video={props.game.video}
                    screenshots={props.game.screenshots}
                    mediaCarouselElement={props.mediaCarouselElement}
                />
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
