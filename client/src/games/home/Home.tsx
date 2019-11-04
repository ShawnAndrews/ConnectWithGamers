import * as React from 'react';
import { GameResponse, SidenavEnums, CurrencyType } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import Slider from "react-slick";
import { Button } from '@material-ui/core';
import { TimeGamesOptions } from './HomeContainer';
import SteamSalesBannerContainer from './steamsalesbanner/SteamSalesBannerContainer';
import GameListContainer, { GameListType } from '../game/GameListContainer';
import { getGameBestPricingStatus, getPriceInUserCurrency } from '../../util/main';
import { Textfit } from 'react-textfit';
import CheapGamesBannerContainer from './cheapgamesbanner/CheapGamesBannerContainer';
import EndingSoonBannerContainer from './endingsoonbanner/EndingSoonBannerContainer';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    featuredGames: GameResponse[];
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
    endingSoonGames: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
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

    return (
        <>
            <Slider {...settings} >
                {props.games && 
                    props.games.map((game: GameResponse, index: number) => (
                        <div className="item">
                            <video className="video-preview w-100 h-100" muted={true} autoPlay={true} loop={true} onEnded={() => {}} playsInline={true} onClick={() => {}}>
                                <source src={game.video} type="Video/mp4"/>
                                <span>Your browser does not support the video tag.</span>
                            </video>
                            <div className="highlighted-table-text">
                                <Textfit className='name' min={18} max={30}>
                                    {game.name}
                                </Textfit>
                                <Button
                                    className="price-btn mt-1" 
                                    variant="contained"
                                    onClick={() => props.goToRedirect(`/search/game/${game.steamId}`)}
                                >
                                    {getPriceInUserCurrency(getGameBestPricingStatus(game.pricings).price, props.currencyType, props.currencyRate)}
                                </Button>
                            </div>
                        </div>
                    ))}
            </Slider>
            <h5 className="header color-tertiary px-5 mb-3">
                <i className="far fa-star d-inline-block mr-2"/>
                <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/popular`)}>Featured</div>
            </h5>
            <div className="grid-results featured-games px-5 pb-5 mt-5">
                {props.featuredGames && props.featuredGames
                    .map((game: GameResponse, index: number) => (
                        <GameListContainer
                            type={GameListType.FullsizeCover}
                            game={game}
                            index={index}
                        />
                    ))}
            </div>
            <SteamSalesBannerContainer
                goToRedirect={props.goToRedirect}
                sidebarActiveEnum={props.sidebarActiveEnum}
                games={props.weeklyGames}
            />
            <div className="px-5">
                <div className="time-games align-top d-inline-block mb-4">
                    <div className="button-group">
                        <a className={`button-group-item ${props.timeGamesOption === TimeGamesOptions.Upcoming ? 'active' : ''}`} onClick={() => props.changeTimeGamesOption(TimeGamesOptions.Upcoming)}>Upcoming</a>
                        <a className={`button-group-item ${props.timeGamesOption === TimeGamesOptions.Recent ? 'active' : ''}`} onClick={() => props.changeTimeGamesOption(TimeGamesOptions.Recent)}>Recent</a>
                        <a className={`button-group-item ${props.timeGamesOption === TimeGamesOptions.Early ? 'active' : ''}`} onClick={() => props.changeTimeGamesOption(TimeGamesOptions.Early)}>Early Access</a>
                    </div>
                    <div className="show cursor-pointer" onClick={props.goToOption}>Show All<i className="fas fa-chevron-right ml-1"/></div>

                    <div className="underline w-100 mt-2 mb-4"/>
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
                <EndingSoonBannerContainer
                    goToRedirect={props.goToRedirect}
                    sidebarActiveEnum={props.sidebarActiveEnum}
                    games={props.endingSoonGames}
                    currencyType={props.currencyType}
                    currencyRate={props.currencyRate}
                />
            </div>
            <CheapGamesBannerContainer
                goToRedirect={props.goToRedirect}
                sidebarActiveEnum={props.sidebarActiveEnum}
                games={props.weeklyGames}
            />
        </>
    );

};

export default Home;
