const popupS = require('popups');
import * as Redux from 'redux';
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Showcase from './Showcase';
import { PredefinedGameResponse, PredefinedGamesResponse, SingleNewsResponse, MultiNewsResponse, SwipeState } from '../../../client-server-common/common';
import { MenuReduxState } from '../../reducers/main';
import { setMouseInPopularFilter, setMouseNotInPopularFilter } from '../../actions/main';

interface IShowcaseContainerProps extends RouteComponentProps<any> {
    
}

interface IShowcaseContainerState {
    isLoading: boolean;
    filterNavWidth: number;
    swipeState: SwipeState;
    reviewedGames: PredefinedGameResponse[];
    popularGames: PredefinedGameResponse[];
    recentGames: PredefinedGameResponse[];
    upcomingGames: PredefinedGameResponse[];
    news: SingleNewsResponse[];
}

interface ReduxStateProps {
    swipeState: SwipeState;
    filterNavWidth: number;
}

interface ReduxDispatchProps {
    setMouseInPopularFilter: () => void;
    setMouseNotInPopularFilter: () => void;
}

type Props = IShowcaseContainerProps & ReduxStateProps & ReduxDispatchProps;

class ShowcaseContainer extends React.Component<Props, IShowcaseContainerState> {

    constructor(props: Props) {
        super(props);
        this.goToRedirect = this.goToRedirect.bind(this);
        this.popularMouseDownCallback = this.popularMouseDownCallback.bind(this);
        this.popularMouseUpCallback = this.popularMouseUpCallback.bind(this);

        this.state = {
            isLoading: true,
            filterNavWidth: props.filterNavWidth,
            swipeState: props.swipeState,
            reviewedGames: undefined,
            popularGames: undefined,
            recentGames: undefined,
            upcomingGames: undefined,
            news: undefined
        };
    }

    componentDidMount(): void {
        const showcasePromises: Promise<any>[] = [];

        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/reviewed`));
        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/popular`));
        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/recent`));
        showcasePromises.push(IGDBService.httpGenericGetData<PredefinedGamesResponse>(`/igdb/games/upcoming`));
        showcasePromises.push(IGDBService.httpGenericGetData<MultiNewsResponse>(`/igdb/games/news`));

        Promise.all(showcasePromises)
            .then((vals: any) => {
                let reviewedGames: PredefinedGameResponse[] = undefined;
                let popularGames: PredefinedGameResponse[] = undefined;
                let recentGames: PredefinedGameResponse[] = undefined;
                let upcomingGames: PredefinedGameResponse[] = undefined;
                let news: SingleNewsResponse[] = undefined;

                if (vals[0]) {
                    const response: PredefinedGamesResponse = vals[0];
                    const numOfReviewedGamesToShow: number = 6;
                    reviewedGames = response.data.slice(0, numOfReviewedGamesToShow);
                }
                if (vals[1]) {
                    const response: PredefinedGamesResponse = vals[1];
                    const numOfPopularGamesToShow: number = 20;
                    popularGames = response.data.slice(0, numOfPopularGamesToShow);
                }
                if (vals[2]) {
                    const response: PredefinedGamesResponse = vals[2];
                    const numOfRecentGamesToShow: number = 10;
                    recentGames = response.data.slice(0, numOfRecentGamesToShow);
                }
                if (vals[3]) {
                    const response: PredefinedGamesResponse = vals[3];
                    const numOfUpcomingGamesToShow: number = 10;
                    upcomingGames = response.data.slice(0, numOfUpcomingGamesToShow);
                }
                if (vals[4]) {
                    const response: MultiNewsResponse = vals[4];
                    const numOfNewsArticlesToShow: number = 6;
                    news = response.data.slice(0, numOfNewsArticlesToShow);
                }

                this.setState({
                    isLoading: false,
                    reviewedGames: reviewedGames,
                    popularGames: popularGames,
                    recentGames: recentGames,
                    upcomingGames: upcomingGames,
                    news: news
                });
            })
            .catch((error: string) => {
                popupS.modal({ content: `<div>• Error loading menu.</div>` });
            });
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    popularMouseDownCallback(): void {
        this.props.setMouseInPopularFilter();
    }

    popularMouseUpCallback(): void {
        this.props.setMouseNotInPopularFilter();
    }

    render() {
        return (
            <Showcase
                isLoading={this.state.isLoading}
                goToRedirect={this.goToRedirect}
                popularMouseDownCallback={this.popularMouseDownCallback}
                popularMouseUpCallback={this.popularMouseUpCallback}
                reviewedGames={this.state.reviewedGames}
                popularGames={this.state.popularGames}
                recentGames={this.state.recentGames}
                upcomingGames={this.state.upcomingGames}
                news={this.state.news}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IShowcaseContainerProps): ReduxStateProps => {
    const menuReduxState: MenuReduxState = state.menu;
    return {
        swipeState: menuReduxState.swipeStateFilter,
        filterNavWidth: menuReduxState.filterNavWidth
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IShowcaseContainerProps): ReduxDispatchProps => ({
    setMouseInPopularFilter: () => { dispatch(setMouseInPopularFilter()); },
    setMouseNotInPopularFilter: () => { dispatch(setMouseNotInPopularFilter()); }
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IShowcaseContainerProps>
    (mapStateToProps, mapDispatchToProps)(ShowcaseContainer));