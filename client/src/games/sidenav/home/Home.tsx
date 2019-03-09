import * as React from 'react';
import { SnackbarContent, IconButton } from '@material-ui/core';

export enum HomeOptionsEnum {
    MostPopular,
    RecentlyReleased,
    Upcoming,
    IOSComingSoon,
    AndroidComingSoon
}

interface IHomeProps {
    isSelected: (homeOptionEnum: HomeOptionsEnum) => boolean;
    onOptionClick: (homeOptionEnum: HomeOptionsEnum) => void;
    onClickBreakingNews: (link: string) => void;
    onClickBreakingNewsCollapse: () => void;
    breakingNewsClickCollapsed: boolean;
    breakingNewsGameName: string;
    breakingNewsGameId: number;
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    return (
        <div className="home">
            <SnackbarContent
                className={`breaking-news ${props.breakingNewsClickCollapsed && `collapsed`} mx-auto px-3 py-1`}
                message={
                    <span>
                        Check out the recently released <u className="cursor-pointer" onClick={() => props.onClickBreakingNews(`search/game/${props.breakingNewsGameId}`)}>{props.breakingNewsGameName}</u> now!
                    </span>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => props.onClickBreakingNewsCollapse()}
                    >
                        <i className="fas fa-times"/>
                    </IconButton>,
                ]}
                
            />
            <div className="px-3 my-3">
                <div className="title mb-2">Browse all games</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.MostPopular)}>
                    <i className="fas fa-fire mr-3"/>
                    Most Popular
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.RecentlyReleased) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.RecentlyReleased)}>
                    <i className="far fa-calendar-alt mr-3"/>
                    Recently Released
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.Upcoming) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Upcoming)}>
                    <i className="far fa-clock mr-3"/>
                    Upcoming
                </div>
            </div>
        </div>
    );

};

export default Home;
