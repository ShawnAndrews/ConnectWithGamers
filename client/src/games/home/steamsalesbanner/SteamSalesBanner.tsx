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
        <div className="steam-banner position-relative w-100 overflow-hidden mb-5">
            <img src="https://i.imgur.com/D7hYPWq.png" />
            <div className="filter-black" />
            <div className={`filter-steamsales-gradient ${props.sidebarActiveEnum === undefined ? 'expanded' : ''}`}>
                <div className="description">
                    <div className="h3 text-center">Weeklong Steam Deals</div>
                    <SteamSalesTimerContainer/>
                    <div className="text-center">
                        <Button className="more-button" onClick={() => props.goToRedirect(`/search/steam/weeklydeals`)} variant="outlined">
                            See more <i className="fas fa-chevron-right ml-2"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default SteamSalesBanner;
