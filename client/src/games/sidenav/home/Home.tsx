import * as React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

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
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    return (
        <div className="home">
            <div className="px-3 my-3">
                <div className="title mb-2">Browse</div>
                <div className={`option py-1 color-tertiary ${props.isSelected(HomeOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.MostPopular)}>
                    <i className="fas fa-fire mr-2"/>
                    Most Popular
                </div>
                <div className={`option py-1 color-tertiary ${props.isSelected(HomeOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.RecentlyReleased)}>
                    <i className="far fa-calendar-alt mr-2"/>
                    Recently Released
                </div>
                <div className={`option py-1 color-tertiary ${props.isSelected(HomeOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Upcoming)}>
                    <i className="far fa-clock mr-2"/>
                    Upcoming
                </div>
                <div className={`option py-1 color-tertiary ${props.isSelected(HomeOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.IOSComingSoon)}>
                    <i className="fab fa-app-store-ios mr-2"/>
                    IOS Apps Coming Soon
                </div>
                <div className={`option py-1 color-tertiary ${props.isSelected(HomeOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.AndroidComingSoon)}>
                    <i className="fab fa-google-play mr-2"/>
                    Android Apps Coming Soon
                </div>
            </div>
        </div>
    );

};

export default Home;
