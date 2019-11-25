import * as React from 'react';
import { SidenavEnums, GameResponse, CurrencyType, PlatformEnum, IdNamePair, PricingStatus } from '../../../../client-server-common/common';
import Slider from "react-slick";
import { getLatestMainGamePricingStatus, getPriceInUserCurrency, getBasePrice } from '../../../util/main';
import { Textfit } from 'react-textfit';
import { Button } from '@material-ui/core';
import GameListContainer, { GameListType } from '../../game/GameListContainer';

interface IPriceyGamesProps {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    under5Games: GameResponse[];
    under10Games: GameResponse[];
    mostexpensiveGames: GameResponse[];
    currencyType: CurrencyType;
    currencyRate: number;
    currentIndex: number;
}

const PriceyGames: React.SFC<IPriceyGamesProps> = (props: IPriceyGamesProps) => {

    return (
        <div className="pricey-games w-100 mt-3">
            <div className="pricey-games-item">
                <div className="pricey-games-label px-3">
                    <i className="fas fa-money-bill-wave d-inline-block mr-2"/>
                    <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/under5`)}>Under $5</div>
                </div>
                <div className="grid-results w-100 m-0">
                    {props.under5Games && 
                        props.under5Games
                            .map((game: GameResponse, index: number) => {
                                return (
                                    <GameListContainer
                                        key={index}
                                        type={GameListType.FullsizeCover}
                                        game={game}
                                        index={index}
                                    />
                                );
                            })
                        }
                </div>
            </div>
            <div className="pricey-games-item">
                <div className="pricey-games-label px-3">
                    <i className="fas fa-money-bill-wave d-inline-block mr-2"/>
                    <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/under10`)}>Under $10</div>
                </div>
                <div className="grid-results w-100 m-0">
                    {props.under10Games && 
                        props.under10Games
                            .map((game: GameResponse, index: number) => {
                                return (
                                    <GameListContainer
                                        key={index}
                                        type={GameListType.FullsizeCover}
                                        game={game}
                                        index={index}
                                    />
                                );
                            })
                        }
                </div>
            </div>
            <div className="pricey-games-item">
                <div className="pricey-games-label px-3">
                    <i className="fas fa-money-bill-wave d-inline-block mr-2"/>
                    <div className="d-inline-block title" onClick={() => props.goToRedirect(`/search/steam/mostexpensive`)}>Most expensive</div>
                </div>
                <div className="grid-results w-100 m-0">
                    {props.mostexpensiveGames && 
                        props.mostexpensiveGames
                            .map((game: GameResponse, index: number) => {
                                return (
                                    <GameListContainer
                                        key={index}
                                        type={GameListType.FullsizeCover}
                                        game={game}
                                        index={index}
                                    />
                                );
                            })
                        }
                </div>
            </div>
        </div>
    );

};

export default PriceyGames;
