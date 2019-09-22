import * as React from 'react';
import { SidenavEnums, GameResponse } from '../../../../client-server-common/common';
import SteamSalesTimerContainer from './SteamSalesTimerContainer';
import { Button } from '@material-ui/core';
import GameListContainer, { GameListType } from '../../game/GameListContainer';

interface ISteamSalesBannerProps {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    games: GameResponse[];
    weeklyGamesToDisplay: number;
}

const SteamSalesBanner: React.SFC<ISteamSalesBannerProps> = (props: ISteamSalesBannerProps) => {

    let gridTemplateColumns: string = "";

    for (let i = 0; i < props.weeklyGamesToDisplay; i++) {
        gridTemplateColumns = gridTemplateColumns.concat("auto ");
    }

    const gridStyle = {
        gridTemplateColumns: gridTemplateColumns
    };

    return (
        <div className="steam-banner position-relative w-100 overflow-hidden px-5 mb-5">
            <img src="https://i.imgur.com/77wnr4y.jpg" />
            <div className="filter-black mx-5" />
            <div className={`filter-steamsales ${props.sidebarActiveEnum === undefined ? 'expanded' : ''}`} />
            <div className={`filter-steamsales-gradient ${props.sidebarActiveEnum === undefined ? 'expanded' : ''}`} />
            <div className="description ml-4">
                <div className="h3 font-weight-bold">Weeklong Steam Deals</div>
                <SteamSalesTimerContainer/>
                <div className="text-center">
                    <Button className="color-primary bg-secondary-solid" onClick={() => props.goToRedirect(`/search/steam/weeklydeals`)} variant="contained">
                        See more <i className="fas fa-chevron-right ml-2"/>
                    </Button>
                </div>
            </div>
            <div className="steam-banner-games text-center">
                <div className="grid-results h-100" style={gridStyle}>
                    {props.games && props.games
                        .filter((game: GameResponse) => game.cover)
                        .sort((a: GameResponse, b: GameResponse) => (b.review.id - a.review.id))
                        .slice(0, props.weeklyGamesToDisplay)
                        .map((game: GameResponse) => 
                            <GameListContainer
                                type={GameListType.Transparent}
                                game={game}
                                transparentSmallCover={false}
                            />
                        )}
                </div>
            </div>
        </div>
    );

};

export default SteamSalesBanner;
