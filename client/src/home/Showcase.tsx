import * as React from 'react';
import RecentGameListContainer from './recent/RecentGameListContainer';
import PopularGameListContainer from './popular/PopularGameListContainer';
import UpcomingGameListContainer from './upcoming/UpcomingGameListContainer';
import HighlightedGameListContainer from './highlighted/HighlightedGameListContainer';
import Profiles from './profiles/Profiles';
import NewsListContainer from './news/NewsListContainer';
import { GameResponse, NewsArticle } from '../../client-server-common/common';
import Spinner from './../spinner/main';
import DiscountedGameListContainer from './discounted/DiscountedGameListContainer';

interface IShowcaseProps {
    isLoading: boolean;
    goToRedirect: (URL: string) => void;
    highlightedGames: GameResponse[];
    popularGames: GameResponse[];
    recentGames: GameResponse[];
    upcomingGames: GameResponse[];
    discountedGames: GameResponse[];
    news: NewsArticle[];
}

const Showcase: React.SFC<IShowcaseProps> = (props: IShowcaseProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="vh-40" loadingMsg="Loading games..." />
        );
    }

    return (
        <div className="home">
            <DiscountedGameListContainer
                discountedGames={props.discountedGames}
            />
            <div className="container">
                <div className="row px-xs-4 px-lg-0">
                    <HighlightedGameListContainer
                        highlightedGames={props.highlightedGames}
                    />
                    <div className="col-md-9 col-lg-4 px-md-0 py-md-3 py-lg-0">
                        <div className="row pl-md-0 pl-lg-4 h-100">
                            <RecentGameListContainer
                                recentGames={props.recentGames}
                            />
                            <UpcomingGameListContainer
                                upcomingGames={props.upcomingGames}
                            />
                        </div>
                    </div>
                    <Profiles
                        goToRedirectCallback={props.goToRedirect}
                    />
                    <PopularGameListContainer
                        popularGames={props.popularGames}
                    />
                    <NewsListContainer
                        news={props.news}
                    />
                </div>
            </div>
        </div>
    );

};

export default Showcase;