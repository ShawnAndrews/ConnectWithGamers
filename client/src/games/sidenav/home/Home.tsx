import * as React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

interface IHomeProps {
    browsePopularSelected: boolean;
    browseRecentSelected: boolean;
    browseUpcomingSelected: boolean;
    browseIOSSoonSelected: boolean;
    browseAndroidSoonSelected: boolean;
    onPopularClick: (checked: boolean) => void;
    onRecentClick: (checked: boolean) => void;
    onUpcomingClick: (checked: boolean) => void;
    onIOSSoonClick: (checked: boolean) => void;
    onAndroidSoonClick: (checked: boolean) => void;
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    return (
        <div className="home">
            <div className="px-3 my-3">
                <div className="title mb-2">Browse</div>
                <FormControlLabel
                    className="filter-checkbox"
                    control={
                        <Checkbox className="check" checked={props.browsePopularSelected} value={props.browsePopularSelected} onChange={(event: any, checked: boolean) => props.onPopularClick(checked)} />
                    }
                    label="Most Popular"
                />
                <FormControlLabel
                    className="filter-checkbox"
                    control={
                        <Checkbox className="check" checked={props.browseRecentSelected} value={props.browseRecentSelected} onChange={(event: any, checked: boolean) => props.onRecentClick(checked)} />
                    }
                    label="Recently Released"
                />
                <FormControlLabel
                    className="filter-checkbox"
                    control={
                        <Checkbox className="check" checked={props.browseUpcomingSelected} value={props.browseUpcomingSelected} onChange={(event: any, checked: boolean) => props.onUpcomingClick(checked)} />
                    }
                    label="Upcoming"
                />
                <FormControlLabel
                    className="filter-checkbox"
                    control={
                        <Checkbox className="check" checked={props.browseIOSSoonSelected} value={props.browseIOSSoonSelected} onChange={(event: any, checked: boolean) => props.onIOSSoonClick(checked)} />
                    }
                    label="IOS Apps Coming Soon"
                />
                <FormControlLabel
                    className="filter-checkbox"
                    control={
                        <Checkbox className="check" checked={props.browseAndroidSoonSelected} value={props.browseAndroidSoonSelected} onChange={(event: any, checked: boolean) => props.onAndroidSoonClick(checked)} />
                    }
                    label="Android Apps Coming Soon"
                />
            </div>
        </div>
    );

};

export default Home;