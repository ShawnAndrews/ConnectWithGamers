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
        
        const newsNewsGameId: number = 112870;
        const newNewsGameName: string = `Spellbreak`;
        
        let newsClosed: boolean = false
        const cookieMatch: string[] = document.cookie.match(new RegExp(`${BREAKING_NEWS_TOKEN_NAME}=([^;]+)`));
        if (cookieMatch) {
            const oldNewsGameName: string = decodeURIComponent(cookieMatch[1]);
            if (oldNewsGameName === newNewsGameName) {
                newsClosed = true;
            }
        }

        this.state = {
            selectedOption: undefined,
            breakingNewsClickCollapsed: newsClosed,
            breakingNewsGameName: newNewsGameName,
            breakingNewsGameId: newsNewsGameId,
            genresExpanded: false,
            vrExpanded: false
        };
    }

    goToOption(homeOptionEnum: HomeOptionsEnum): void {
        if (homeOptionEnum === HomeOptionsEnum.MostPopular) {
            this.props.history.push(`/search/popular`);
        } else if (homeOptionEnum === HomeOptionsEnum.RecentlyReleased) {
            this.props.history.push(`/search/recent`);
        } else if (homeOptionEnum === HomeOptionsEnum.Upcoming) {
            this.props.history.push(`/search/upcoming`);
        }
    }

    onOptionClick(homeOptionEnum: HomeOptionsEnum): void {

        this.setState({
            selectedOption: homeOptionEnum,
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