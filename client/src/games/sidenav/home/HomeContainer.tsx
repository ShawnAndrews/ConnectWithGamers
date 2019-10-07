import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Home, { HomeOptionsEnum } from './Home';
import { BREAKING_NEWS_TOKEN_NAME } from '../../../../client-server-common/common';

interface IHomeContainerProps extends RouteComponentProps<any> {
    
}

interface IHomeContainerState {
    selectedOption: HomeOptionsEnum;
    breakingNewsClickCollapsed: boolean;
    breakingNewsGameName: string;
    breakingNewsGameId: number;
    genresExpanded: boolean;
    vrExpanded: boolean;
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);
        this.goToOption = this.goToOption.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.onBreakingNewsClick = this.onBreakingNewsClick.bind(this);
        this.onClickBreakingNewsCollapse = this.onClickBreakingNewsCollapse.bind(this);
        
        const newsNewsGameId: number = 118610;
        const newNewsGameName: string = `Call of the void`;
        
        let newsClosed: boolean = false;
        const cookieMatch: string[] = document.cookie.match(new RegExp(`${BREAKING_NEWS_TOKEN_NAME}=([^;]+)`));
        if (cookieMatch) {
            const oldNewsGameName: string = decodeURIComponent(cookieMatch[1]);
            if (oldNewsGameName === newNewsGameName) {
                newsClosed = true;
            }
        }

        this.state = {
            selectedOption: HomeOptionsEnum.Home,
            breakingNewsClickCollapsed: newsClosed,
            breakingNewsGameName: newNewsGameName,
            breakingNewsGameId: newsNewsGameId,
            genresExpanded: false,
            vrExpanded: false
        };
    }

    goToOption(homeOptionEnum: HomeOptionsEnum): void {
        if (homeOptionEnum === HomeOptionsEnum.MostPopular) {
            this.props.history.push(`/search/steam/popular`);
        } else if (homeOptionEnum === HomeOptionsEnum.RecentlyReleased) {
            this.props.history.push(`/search/steam/recent`);
        } else if (homeOptionEnum === HomeOptionsEnum.Upcoming) {
            this.props.history.push(`/search/steam/upcoming`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreAction) {
            this.props.history.push(`/search/steam/genre/action`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreAdventure) {
            this.props.history.push(`/search/steam/genre/adventure`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreCasual) {
            this.props.history.push(`/search/steam/genre/casual`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreStrategy) {
            this.props.history.push(`/search/steam/genre/strategy`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreRacing) {
            this.props.history.push(`/search/steam/genre/racing`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreSimulation) {
            this.props.history.push(`/search/steam/genre/simulation`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreSports) {
            this.props.history.push(`/search/steam/genre/sports`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreIndie) {
            this.props.history.push(`/search/steam/genre/indie`);
        } else if (homeOptionEnum == HomeOptionsEnum.Genre2D) {
            this.props.history.push(`/search/steam/genre/2d`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenrePuzzle) {
            this.props.history.push(`/search/steam/genre/puzzle`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreShooter) {
            this.props.history.push(`/search/steam/genre/shooter`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreRTS) {
            this.props.history.push(`/search/steam/genre/rts`);
        } else if (homeOptionEnum == HomeOptionsEnum.GenreTowerDefence) {
            this.props.history.push(`/search/steam/genre/towerdefence`);
        } else if (homeOptionEnum == HomeOptionsEnum.WeeklyDeals) {
            this.props.history.push(`/search/steam/weeklydeals`);
        } else if (homeOptionEnum == HomeOptionsEnum.CompetitiveMultiplayer) {
            this.props.history.push(`/search/steam/compmulti`);
        } else if (homeOptionEnum == HomeOptionsEnum.FreeMultiplayer) {
            this.props.history.push(`/search/steam/freeonlinemulti`);
        } else if (homeOptionEnum == HomeOptionsEnum.PaidMultiplayer) {
            this.props.history.push(`/search/steam/paidonlinemulti`);
        } else if (homeOptionEnum == HomeOptionsEnum.MostDifficult) {
            this.props.history.push(`/search/steam/mostdifficult`);
        } else if (homeOptionEnum == HomeOptionsEnum.Horror) {
            this.props.history.push(`/search/steam/horror`);
        } else if (homeOptionEnum == HomeOptionsEnum.VRHTC) {
            this.props.history.push(`/search/steam/vrhtc`);
        } else if (homeOptionEnum == HomeOptionsEnum.VROculus) {
            this.props.history.push(`/search/steam/vrvive`);
        } else if (homeOptionEnum == HomeOptionsEnum.VRWindows) {
            this.props.history.push(`/search/steam/vrwindows`);
        } else if (homeOptionEnum == HomeOptionsEnum.VRAll) {
            this.props.history.push(`/search/steam/vrall`);
        } else if (homeOptionEnum == HomeOptionsEnum.MOBO) {
            this.props.history.push(`/search/steam/mobo`);
        } else if (homeOptionEnum == HomeOptionsEnum.EarlyAccess) {
            this.props.history.push(`/search/steam/earlyaccess`);
        } else if (homeOptionEnum == HomeOptionsEnum.OpenWorld) {
            this.props.history.push(`/search/steam/openworld`);
        } else if (homeOptionEnum == HomeOptionsEnum.FPS) {
            this.props.history.push(`/search/steam/fps`);
        } else if (homeOptionEnum == HomeOptionsEnum.Cards) {
            this.props.history.push(`/search/steam/cards`);
        } else if (homeOptionEnum == HomeOptionsEnum.MMORPG) {
            this.props.history.push(`/search/steam/mmorpg`);
        } else if (homeOptionEnum == HomeOptionsEnum.Survival) {
            this.props.history.push(`/search/steam/survival`);
        }
    }

    onOptionClick(homeOptionEnum: HomeOptionsEnum): void {

        this.setState({
            selectedOption: (homeOptionEnum !== HomeOptionsEnum.Genres && homeOptionEnum !== HomeOptionsEnum.VRSupported) ? homeOptionEnum : this.state.selectedOption,
            genresExpanded: homeOptionEnum === HomeOptionsEnum.Genres ? !this.state.genresExpanded : this.state.genresExpanded,
            vrExpanded: homeOptionEnum === HomeOptionsEnum.VRSupported ? !this.state.vrExpanded : this.state.vrExpanded,
        });

        this.goToOption(homeOptionEnum);
    }

    isSelected(homeOptionEnum: HomeOptionsEnum): boolean {

        if (homeOptionEnum === this.state.selectedOption) {
            return true;
        }

        return false;
    }

    onBreakingNewsClick(link: string): void {
        this.props.history.push(link);
    }

    onClickBreakingNewsCollapse(): void {
        document.cookie = `${BREAKING_NEWS_TOKEN_NAME}=${encodeURIComponent(this.state.breakingNewsGameName)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;`;
        this.setState({ breakingNewsClickCollapsed: true });
    }

    render() {
        return (
            <Home
                onOptionClick={this.onOptionClick}
                isSelected={this.isSelected}
                onClickBreakingNews={this.onBreakingNewsClick}
                onClickBreakingNewsCollapse={this.onClickBreakingNewsCollapse}
                breakingNewsClickCollapsed={this.state.breakingNewsClickCollapsed}
                breakingNewsGameName={this.state.breakingNewsGameName}
                breakingNewsGameId={this.state.breakingNewsGameId}
                genresExpanded={this.state.genresExpanded}
                vrExpanded={this.state.vrExpanded}
            />
        );
    }

}

export default withRouter(HomeContainer);