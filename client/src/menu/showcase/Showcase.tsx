import * as React from 'react';
import RecentGameListContainer from '../recent/RecentGameListContainer';
import PopularGameListContainer from '../popular/PopularGameListContainer';
import UpcomingGameListContainer from '../upcoming/UpcomingGameListContainer';
import ReviewedGameListContainer from '../reviewed/ReviewedGameListContainer';
import SearchBarContainer from '../searchbar/SearchBarContainer';
import Profiles from '../profiles/Profiles';
import NewsListContainer from '../news/NewsListContainer';
import { PredefinedGameResponse, SingleNewsResponse } from '../../../client-server-common/common';
import Spinner from '../../spinner/main';

interface IShowcaseProps {
    isLoading: boolean;
    goToRedirect: (URL: string) => void;
    popularMouseDownCallback: () => void;
    popularMouseUpCallback: () => void;
    reviewedGames: PredefinedGameResponse[];
    popularGames: PredefinedGameResponse[];
    recentGames: PredefinedGameResponse[];
    upcomingGames: PredefinedGameResponse[];
    news: SingleNewsResponse[];
}

const Showcase: React.SFC<IShowcaseProps> = (props: IShowcaseProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="middle" loadingMsg="Loading menu..." />
        );
    }

    return (
        <>
            <SearchBarContainer/>
            <h1 className="menu-header">Explore new games today!</h1>
            <ReviewedGameListContainer
                reviewedGames={props.reviewedGames}
            />
            <div className="menu-recent-upcoming-container">
                <RecentGameListContainer
                    recentGames={props.recentGames}
                />
                <UpcomingGameListContainer
                    upcomingGames={props.upcomingGames}
                />
            </div>
            <PopularGameListContainer
                popularGames={props.popularGames}
                popularMouseDownCallback={props.popularMouseDownCallback}
                popularMouseUpCallback={props.popularMouseUpCallback}
            />
            <Profiles
                goToRedirectCallback={props.goToRedirect}
            />
            <NewsListContainer
                news={props.news}
            />
        </>
    );

};

export default Showcase;