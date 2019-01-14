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
import Footer from '../footer/footer';

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
        <>
            <div className="home">
                <div className="banner">
                    
                </div>
                <DiscountedGameListContainer
                    discountedGames={props.discountedGames}
                />
                <div className="container">
                    <div className="px-xs-4 px-lg-0">
                        <HighlightedGameListContainer
                            highlightedGames={props.highlightedGames}
                        />
                        <div className="h-100">
                            <RecentGameListContainer
                                recentGames={props.recentGames}
                            />
                            <UpcomingGameListContainer
                                upcomingGames={props.upcomingGames}
                            />
                        </div>
                        <div className="row mx-0 mb-5">
                            <Profiles
                                goToRedirectCallback={props.goToRedirect}
                            />
                            <PopularGameListContainer
                                popularGames={props.popularGames}
                            />
                        </div>
                        <NewsListContainer
                            news={props.news}
                        />
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );

};

export default Showcase;