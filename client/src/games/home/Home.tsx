import * as React from 'react';
import { GameResponse, GenreEnums, NewsArticle, SidenavEnums } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import Slider from "react-slick";
import FullsizeGameContainer from '../game/fullsize/FullsizeGameContainer';
import Footer from '../../footer/footer';
import { Textfit } from 'react-textfit';
import { Button } from '@material-ui/core';
import { BigGameInfo, TimeGamesOptions } from './HomeContainer';
import SteamSalesTimerContainer from './steamsalesbanner/SteamSalesTimerContainer';
import SteamSalesBannerContainer from './steamsalesbanner/SteamSalesBannerContainer';
import NewsListContainer from '../news/NewsListContainer';
import GameListContainer, { GameListType } from '../game/GameListContainer';
import GenreBannerContainer from './genrebanner/GenreBannerContainer';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    bigGames: GameResponse[];
    bigGamesInfo: BigGameInfo[];
    featuredGames: GameResponse[];
    featuredEditorsGamesIndicies: number[];
    featuredBigGamesIndicies: number[];
    news: NewsArticle[];
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    weeklyGames: GameResponse[];
    timeGamesOption: TimeGamesOptions;
    changeTimeGamesOption: (timeGamesOption: TimeGamesOptions) => void;
    goToOption: () => void;
    upcomingGames: GameResponse[];
    recentGames: GameResponse[];
    earlyGames: GameResponse[];
    horrorGames: GameResponse[];
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="vh-40" loadingMsg={props.loadingMsg} />
        );
    }

    const settings = {
        className: "editors-games-carousel mb-5",
        infinite: true,
        dots: true,
        swipeToSlide: true,
        variableWidth: false,
        arrows: false
    };
    const timeGames: GameResponse[] = props.timeGamesOption === TimeGamesOptions.Upcoming ? props.upcomingGames : (props.timeGamesOption === TimeGamesOptions.Recent ? props.recentGames : props.earlyGames);

    for (let i = 0; i < timeGames.length; i++) {
        console.log(`${timeGames[i].name}: ${timeGames[i].first_release_date}`);
    }

    return (
        <>
            <Slider {...settings} >
                {props.bigGamesInfo && 
                    props.bigGamesInfo.map((gameInfo: BigGameInfo, index: number) => (
                        <div className="item">
                            <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={true} onEnded={() => {}} playsInline={true} onClick={() => {}}>
                                <source src={`/cache/video-previews/${gameInfo.gameId}.mp4`} type="Video/mp4"/>
                                <span>Your browser does not support the video tag.</span>
                            </video>
                            <div className="highlighted-table-text">
                                <Textfit className='name' min={18} max={30}>
                                    {props.bigGames[index].name}
                                </Textfit>
                                <div className='genres'>
                                    {props.bigGames[index].genres && props.bigGames[index].genres.map((x: number) => GenreEnums[x]).join(', ')}
                                </div>
                                <div className='platforms my-1'>
                                    {props.bigGames[index].linkIcons && props.bigGames[index].linkIcons.map((x: string) => <i className={`fab ${x} mx-2`}/>)}
                                </div>
                                <Button
                                    className="price-btn mt-1" 
                                    variant="raised"
                                    onClick={() => window.open(gameInfo.btnLink)}
                                >
                                    {gameInfo.btnText}
                                </Button>
                            </div>
                        </div>
                    ))}
            </Slider>
            <h5 className="header color-tertiary px-5 mb-3">
                <i className="far fa-star d-inline-block mr-2"/>
                <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/popular`)}>Featured</div>
            </h5>
            <div className="grid-results featured-games px-5 pb-5">
                {props.featuredGames && props.featuredGames
                    .map((game: GameResponse, index: number) => {
                        const isEditorsChoiceGame: boolean = props.featuredEditorsGamesIndicies.findIndex((x: number) => x === index) !== -1;
                        const isBigGame: boolean = props.featuredBigGamesIndicies.findIndex((x: number) => x === index) !== -1;

                        return (
                            <GameListContainer
                                type={GameListType.FullsizeCover}
                                game={game}
                                fullsizeIndex={index}
                                fullsizeIsBigGame={isBigGame}
                                fullsizeIsEditorsChoiceGame={isEditorsChoiceGame}
                            />
                        );
                    })}
            </div>
            <SteamSalesBannerContainer
                goToRedirect={props.goToRedirect}
                sidebarActiveEnum={props.sidebarActiveEnum}
                games={props.weeklyGames}
            />
            <div className="px-5">
                <div className="time-games align-top d-inline-block mb-4">
                    <div className="upcoming cursor-pointer" onClick={() => props.changeTimeGamesOption(TimeGamesOptions.Upcoming)}>Upcoming</div>
                    <div className="recent cursor-pointer" onClick={() => props.changeTimeGamesOption(TimeGamesOptions.Recent)}>Recent</div>
                    <div className="early cursor-pointer" onClick={() => props.changeTimeGamesOption(TimeGamesOptions.Early)}>Early Access</div>
                    <div className="show cursor-pointer" onClick={props.goToOption}>Show All<i className="fas fa-chevron-right ml-1"/></div>
                    <div className="underline w-100"/>
                    <div className={`underline-slider ${props.timeGamesOption === TimeGamesOptions.Upcoming ? 'upcoming' : ''} ${props.timeGamesOption === TimeGamesOptions.Recent ? 'recent' : ''} ${props.timeGamesOption === TimeGamesOptions.Early ? 'early' : ''}`}/>
                    <div className="time-games-grid custom-scrollbar-slim">
                        <div className="grid-results h-100">
                            {timeGames && timeGames
                                .map((game: GameResponse) => 
                                    <GameListContainer
                                        type={GameListType.TransparentTime}
                                        game={game}
                                    />
                                )}
                        </div>
                    </div>
                </div>
                <GenreBannerContainer
                    goToRedirect={props.goToRedirect}
                    games={props.horrorGames}
                />
            </div>
            <h5 className="header color-tertiary px-5 mb-3">
                <i className="far fa-newspaper d-inline-block mr-2"/>
                <div className="d-inline-block title" onClick={() => props.goToRedirect(`/news`)}>News</div> 
            </h5>
            <div className="grid-results news px-5 pb-4">
                {props.news && 
                    <NewsListContainer
                        news={props.news}
                        limit={12}
                    />}
            </div>
            <Footer/>
        </>
    );

};

export default Home;
