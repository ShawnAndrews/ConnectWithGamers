const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import SteamSalesBanner from './SteamSalesBanner';
import { SidenavEnums, GameResponse, MultiGameResponse, ExcludedGameIds } from '../../../../client-server-common/common';
import * as IGDBService from '../../../service/igdb/main';

interface ISteamSalesBannerContainerProps extends RouteComponentProps<any> {
    goToRedirect: (URL: string) => void;
    sidebarActiveEnum: SidenavEnums;
    games: GameResponse[];
}

interface ISteamSalesBannerContainerState {
    weeklyGamesToDisplay: number;
}

class SteamSalesBannerContainer extends React.Component<ISteamSalesBannerContainerProps, ISteamSalesBannerContainerState> {

    constructor(props: ISteamSalesBannerContainerProps) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this);

        this.state = {
            weeklyGamesToDisplay: this.calcWeeklyGamesToDisplay(window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth)
        };
    }

    componentDidMount(): void {
        window.addEventListener("resize", this.updateDimensions);
    }

    updateDimensions(): void {
        const 
        w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

        this.setState({ weeklyGamesToDisplay: this.calcWeeklyGamesToDisplay(width) });
    }

    calcWeeklyGamesToDisplay = (width: number): number => (Math.floor((width - 1000) / 107))

    render() {
        return (
            <SteamSalesBanner
                goToRedirect={this.props.goToRedirect}
                sidebarActiveEnum={this.props.sidebarActiveEnum}
                games={this.props.games}
                weeklyGamesToDisplay={this.state.weeklyGamesToDisplay}
            />
        );
    }

}

export default withRouter(SteamSalesBannerContainer);