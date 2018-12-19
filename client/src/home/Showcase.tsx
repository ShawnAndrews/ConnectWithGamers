import * as React from 'react';
import RecentGameListContainer from './recent/RecentGameListContainer';
import PopularGameListContainer from './popular/PopularGameListContainer';
import UpcomingGameListContainer from './upcoming/UpcomingGameListContainer';
import ReviewedGameListContainer from './reviewed/ReviewedGameListContainer';
import Profiles from './profiles/Profiles';
import NewsListContainer from './news/NewsListContainer';
import { PredefinedGameResponse, SingleNewsResponse } from '../../client-server-common/common';
import Spinner from './../spinner/main';

interface IShowcaseProps {
    isLoading: boolean;
    goToRedirect: (URL: string) => void;
    reviewedGames: PredefinedGameResponse[];
    popularGames: PredefinedGameResponse[];
    recentGames: PredefinedGameResponse[];
    upcomingGames: PredefinedGameResponse[];
    news: SingleNewsResponse[];
}

const Showcase: React.SFC<IShowcaseProps> = (props: IShowcaseProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="vh-40" loadingMsg="Loading games..." />
        );
    }

    return (
        <div className="home container">
            <div className="text-center p-3">Explore new games today!</div>
            <div className="row px-xs-4 px-lg-0">
                <ReviewedGameListContainer
                    reviewedGames={props.reviewedGames}
                />
                <div className="col-md-9 col-lg-5 px-md-0 py-md-3 py-lg-0">
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
    );

};

export default Showcase;