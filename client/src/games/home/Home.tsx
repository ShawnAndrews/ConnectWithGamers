import * as React from 'react';
import { GameResponse, SidenavEnums, CurrencyType } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';
import { TimeGamesOptions } from './HomeContainer';
import SteamSalesBannerContainer from './steamsalesbanner/SteamSalesBannerContainer';
import GameListContainer, { GameListType } from '../game/GameListContainer';
import HorrorGamesBannerContainer from './horrorgamesbanner/HorrorGamesBannerContainer';
import EndingSoonBannerContainer from './endingsoonbanner/EndingSoonBannerContainer';
import EditorsGamesContainer from './editorsgames/EditorsGamesContainer';
import PriceyGamesContainer from './priceygames/PriceyGamesContainer';

interface IHomeProps {
    isLoading: boolean;
    loadingMsg: string;
    editorGames: GameResponse[];
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
    recommendedGames: GameResponse[];
    under5Games: GameResponse[];
    under10Games: GameResponse[];
    mostexpensiveGames: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="vh-40" loadingMsg={props.loadingMsg} />
        );
    }

    const timeGames: GameResponse[] = props.timeGamesOption === TimeGamesOptions.Upcoming ? props.upcomingGames : (props.timeGamesOption === TimeGamesOptions.Recent ? props.recentGames : props.earlyGames);
    
    return (
        <>
            <EditorsGamesContainer
                goToRedirect={props.goToRedirect}
                sidebarActiveEnum={props.sidebarActiveEnum}
                editorsGames={props.editorGames}
                currencyRate={props.currencyRate}
                currencyType={props.currencyType}
            />
            <h5 className="header color-tertiary px-5">
                <i className="far fa-star d-inline-block mr-2"/>
                <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/popular/upcoming`)}>Featured</div>
            </h5>
            <div className="grid-results horizontal limit-two-rows px-2 pb-5">
                {props.endingSoonGames && props.endingSoonGames
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
                                .map((game: GameResponse, index: number) => 
                                    <GameListContainer
                                        type={GameListType.TransparentTime}
                                        game={game}
                                        index={index}
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
            <HorrorGamesBannerContainer
                goToRedirect={props.goToRedirect}
                sidebarActiveEnum={props.sidebarActiveEnum}
                games={props.horrorGames}
            />
            <PriceyGamesContainer
                goToRedirect={props.goToRedirect}
                sidebarActiveEnum={props.sidebarActiveEnum}
                under5Games={props.under5Games}
                under10Games={props.under10Games}
                mostexpensiveGames={props.mostexpensiveGames}
                currencyType={props.currencyType}
                currencyRate={props.currencyRate}
            />
        </>
    );

};

export default Home;
