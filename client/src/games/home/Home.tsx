import * as React from 'react';
import { GameResponse, GenreEnums, NewsArticle, SidenavEnums } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import Slider from "react-slick";
import FullsizeGameContainer from '../game/fullsize/FullsizeGameContainer';
import Footer from '../../footer/footer';
import { Textfit } from 'react-textfit';
import { Button } from '@material-ui/core';
import { BigGameInfo } from './HomeContainer';
import SteamSalesTimerContainer from './steamsalesbanner/SteamSalesTimerContainer';
import SteamSalesBannerContainer from './steamsalesbanner/SteamSalesBannerContainer';
import NewsListContainer from '../news/NewsListContainer';
import GameListContainer, { GameListType } from '../game/GameListContainer';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    bigGamesInfo: BigGameInfo[];
    featuredGames: GameResponse[];
    featuredEditorsGamesIndicies: number[];
    featuredBigGamesIndicies: number[];
    news: NewsArticle[];
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    weeklyGames: GameResponse[];
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

    const nextDayAndTime = (dayOfWeek: number, hour: number, minute: number): Date => {
        const now: Date = new Date();
        const result: Date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + (7 + dayOfWeek - now.getDay()) % 7,
            hour,
            minute);

        if (result < now) {
            result.setDate(result.getDate() + 7);
        }

        return result;
    }
    
    return (
        <>
            <Slider {...settings} >
                {props.bigGamesInfo && 
                    props.bigGamesInfo.map((gameInfo: BigGameInfo) => (
                        <div className="item">
                            <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={true} onEnded={() => {}} playsInline={true} onClick={() => {}}>
                                <source src={`/cache/video-previews/${gameInfo.gameId}.mp4`} type="Video/mp4"/>
                                <span>Your browser does not support the video tag.</span>
                            </video>
                            <div className="highlighted-table-text">
                                <Textfit className='name' min={18} max={30}>
                                    {gameInfo.game.name}
                                </Textfit>
                                <div className='genres'>
                                    {gameInfo.game.genres && gameInfo.game.genres.map((x: number) => GenreEnums[x]).join(', ')}
                                </div>
                                <div className='platforms my-1'>
                                    {gameInfo.game.linkIcons && gameInfo.game.linkIcons.map((x: string) => <i className={`fab ${x} mx-2`}/>)}
                                </div>
                                <Button
                                    className="price-btn mt-1" 
                                    variant="raised"
                                    onClick={() => window.open(`${gameInfo.btnText.link}`)}
                                >
                                    {gameInfo.btnText}
                                </Button>
                            </div>
                        </div>
                    ))}
            </Slider>
            <h5 className="header color-tertiary mb-3">
                <i className="far fa-star d-inline-block mr-2"/>
                <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/popular`)}>Featured</div>
            </h5>
            <div className="grid-results games pb-5">
                {props.featuredGames && props.featuredGames
                    .map((game: GameResponse, index: number) => {
                        const isEditorsChoiceGame: boolean = props.featuredEditorsGamesIndicies.findIndex((x: number) => x === index) !== -1;
                        const isBigGame: boolean = props.featuredBigGamesIndicies.findIndex((x: number) => x === index) !== -1;

                        return (
                            <GameListContainer
                                type={GameListType.Fullsize}
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
            <h5 className="header color-tertiary mb-3">
                <i className="far fa-newspaper d-inline-block mr-2"/>
                <div className="d-inline-block title" onClick={() => props.goToRedirect(`/news`)}>News</div> 
            </h5>
            <div className="grid-results news pb-4">
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
