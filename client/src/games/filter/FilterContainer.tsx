import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Filter from './Filter';
import { IdNamePair, IGDBGenreEnums, IGDBPlatformEnums, IGDBCategoryEnums, GamesPresets } from '../../../client-server-common/common';

export enum SortingOptionEnum {
    "PopularityAsc",
    "PopularityDesc",
    "ReleaseDateAsc",
    "ReleaseDateDesc",
    "AlphabeticallyAsc",
    "AlphabeticallyDesc",
}

interface IFilterContainerProps extends RouteComponentProps<any> {
    filterExpanded: boolean;
}

interface IFilterContainerState {
    searchTerm: string;
    browsePopularSelected: boolean;
    browseRecentSelected: boolean;
    browseUpcomingSelected: boolean;
    browseNewsSelected: boolean;
    popularity: number;
    releaseDateStart: Date;
    releaseDateEnd: Date;
    genreOptions: IdNamePair[];
    platformOptions: IdNamePair[];
    sortingOptions: IdNamePair[];
    categoryOptions: IdNamePair[];
    sortingSelection: SortingOptionEnum;
    genresSelection: IdNamePair[];
    platformsSelection: IdNamePair[];
    categorySelection: IdNamePair[];
    cover: boolean;
    screenshots: boolean;
    trailer: boolean;
    disableNonBrowse: boolean;
}

class FilterContainer extends React.Component<IFilterContainerProps, IFilterContainerState> {

    constructor(props: IFilterContainerProps) {
        super(props);
        this.onPopularityChange = this.onPopularityChange.bind(this);
        this.onReleaseDateStartChange = this.onReleaseDateStartChange.bind(this);
        this.onReleaseDateEndChange = this.onReleaseDateEndChange.bind(this);
        this.onSortingSelectionChange = this.onSortingSelectionChange.bind(this);
        this.onGenresSelectionChange = this.onGenresSelectionChange.bind(this);
        this.onPlatformSelectionChange = this.onPlatformSelectionChange.bind(this);
        this.onCategorySelectionChange = this.onCategorySelectionChange.bind(this);
        this.onRefreshClick = this.onRefreshClick.bind(this);
        this.onCoverClick = this.onCoverClick.bind(this);
        this.onScreenshotsClick = this.onScreenshotsClick.bind(this);
        this.onTrailerClick = this.onTrailerClick.bind(this);
        this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);
        this.onSearchKeypress = this.onSearchKeypress.bind(this);
        this.onPopularClick = this.onPopularClick.bind(this);
        this.onRecentClick = this.onRecentClick.bind(this);
        this.onUpcomingClick = this.onUpcomingClick.bind(this);
        this.onNewsClick = this.onNewsClick.bind(this);

        const sortingOptions: IdNamePair[] = [
            { id: SortingOptionEnum.PopularityAsc, name: 'Popularity ↑' },
            { id: SortingOptionEnum.PopularityDesc, name: 'Popularity ↓' },
            { id: SortingOptionEnum.ReleaseDateAsc, name: 'Release Date ↑' },
            { id: SortingOptionEnum.ReleaseDateDesc, name: 'Release Date ↓' },
            { id: SortingOptionEnum.AlphabeticallyAsc, name: 'Alphabetical ↑' },
            { id: SortingOptionEnum.AlphabeticallyDesc, name: 'Alphabetical ↓' },
        ];

        const genreOptions: IdNamePair[] = [
            { id: IGDBGenreEnums.action, name: 'Action' },
            { id: IGDBGenreEnums.adventure, name: 'Adventure' },
            { id: IGDBGenreEnums.shooter, name: 'Shooter' },
            { id: IGDBGenreEnums.simulation, name: 'Simulation' },
            { id: IGDBGenreEnums.rpg, name: 'RPG' },
            { id: IGDBGenreEnums.puzzle, name: 'Puzzle' },
            { id: IGDBGenreEnums.strategy, name: 'Strategy' },
        ];

        const platformOptions: IdNamePair[] = [
            { id: IGDBPlatformEnums.pc, name: 'PC' },
            { id: IGDBPlatformEnums.linux, name: 'Linux' },
            { id: IGDBPlatformEnums.mac, name: 'Mac' },
            { id: IGDBPlatformEnums.vr, name: 'Virtual Reality' },
            { id: IGDBPlatformEnums.switch, name: 'Nintendo Switch' },
            { id: IGDBPlatformEnums.ps4, name: 'Playstation 4' },
            { id: IGDBPlatformEnums.xboxone, name: 'Xbox One' }
        ];

        const categoryOptions: IdNamePair[] = [
            { id: IGDBCategoryEnums.maingame, name: 'Main Game' },
            { id: IGDBCategoryEnums.dlc, name: 'DLC' },
            { id: IGDBCategoryEnums.expansion, name: 'Expansion' },
            { id: IGDBCategoryEnums.bundle, name: 'Bundle' },
            { id: IGDBCategoryEnums.standaloneexpansion, name: 'Standalone Expansion' }
        ];

        this.state = {
            searchTerm: '',
            browsePopularSelected: false,
            browseRecentSelected: false,
            browseUpcomingSelected: false,
            browseNewsSelected: false,
            popularity: 0,
            releaseDateStart: undefined,
            releaseDateEnd: undefined,
            genreOptions: genreOptions,
            categoryOptions: categoryOptions,
            platformOptions: platformOptions,
            sortingOptions: sortingOptions,
            sortingSelection: undefined,
            genresSelection: [],
            platformsSelection: [],
            categorySelection: [],
            cover: false,
            screenshots: false,
            trailer: false,
            disableNonBrowse: false
        };
    }

    onPopularityChange(value: number): void {
        this.setState({
            popularity: value
        });
    }

    onReleaseDateStartChange(date: Date): void {
        this.setState({
            releaseDateStart: date
        });
    }

    onReleaseDateEndChange(date: Date): void {
        this.setState({
            releaseDateEnd: date
        });
    }

    onSortingSelectionChange(event: any): void {
        this.setState({
            sortingSelection: event.target.value
        });
    }

    onGenresSelectionChange(event: any): void {
        const genreNameToAdd: string = event.target.value[event.target.value.length - 1].toString();
        const newGenreSelection: IdNamePair[] = this.state.genresSelection;
        const foundGenreIndex: number = newGenreSelection.findIndex((x: IdNamePair) => x.name === genreNameToAdd);

        if (foundGenreIndex === -1) {
            const genreToAdd: IdNamePair = this.state.genreOptions.find((x: IdNamePair) => x.name === genreNameToAdd);
            newGenreSelection.push(genreToAdd);
        } else {
            newGenreSelection.splice(foundGenreIndex, 1);
        }

        this.setState({
            genresSelection: newGenreSelection
        });
    }

    onPlatformSelectionChange(event: any): void {
        const platformNameToAdd: string = event.target.value[event.target.value.length - 1].toString();
        const newPlatformSelection: IdNamePair[] = this.state.platformsSelection;
        const foundPlatformIndex: number = newPlatformSelection.findIndex((x: IdNamePair) => x.name === platformNameToAdd);

        if (foundPlatformIndex === -1) {
            const platformToAdd: IdNamePair = this.state.platformOptions.find((x: IdNamePair) => x.name === platformNameToAdd);
            newPlatformSelection.push(platformToAdd);
        } else {
            newPlatformSelection.splice(foundPlatformIndex, 1);
        }

        this.setState({
            platformsSelection: newPlatformSelection
        });
    }

    onCategorySelectionChange(event: any): void {
        const categoryNameToAdd: string = event.target.value[event.target.value.length - 1].toString();
        const newCategorySelection: IdNamePair[] = this.state.categorySelection;
        const foundCategoryIndex: number = newCategorySelection.findIndex((x: IdNamePair) => x.name === categoryNameToAdd);

        if (foundCategoryIndex === -1) {
            const categoryToAdd: IdNamePair = this.state.categoryOptions.find((x: IdNamePair) => x.name === categoryNameToAdd);
            newCategorySelection.push(categoryToAdd);
        } else {
            newCategorySelection.splice(foundCategoryIndex, 1);
        }

        this.setState({
            categorySelection: newCategorySelection
        });
    }

    onRefreshClick(): void {
        let queryString: string = `/games/search/filter/?`;
        const filters: string[] = [];
        const required: string[] = [];

        if (this.state.searchTerm) {
            filters.push(`query=${this.state.searchTerm}`);
        }

        if (this.state.releaseDateStart) {
            const timestamp: number = this.state.releaseDateStart.getTime() / 1000;
            filters.push(`released_after=${timestamp}`);
        }

        if (this.state.releaseDateEnd) {
            const timestamp: number = this.state.releaseDateEnd.getTime() / 1000;
            filters.push(`released_before=${timestamp}`);
        }

        if (this.state.popularity) {
            filters.push(`popularity=${this.state.popularity}`);
        }

        if (this.state.genresSelection.length > 0) {
            const genres: string = this.state.genresSelection.map((x: IdNamePair) => x.id).join();
            filters.push(`genres=${genres}`);
        }

        if (this.state.platformsSelection.length > 0) {
            const platforms: string = this.state.platformsSelection.map((x: IdNamePair) => x.id).join();
            filters.push(`platforms=${platforms}`);
        }

        if (this.state.categorySelection.length > 0) {
            const categories: string = this.state.categorySelection.map((x: IdNamePair) => x.id).join();
            filters.push(`categories=${categories}`);
        }

        if (this.state.cover) {
            required.push(`cover`);
        }

        if (this.state.screenshots) {
            required.push(`screenshots`);
        }

        if (this.state.trailer) {
            required.push(`trailer`);
        }

        if (required.length > 0) {
            filters.push(`required=${required.join()}`);
        }

        if (this.state.sortingSelection) {
            
            if (this.state.sortingSelection.valueOf() === SortingOptionEnum.PopularityAsc.valueOf()) {
                filters.push(`sort=popularity:asc`);
            } else if (this.state.sortingSelection.valueOf() === SortingOptionEnum.PopularityDesc.valueOf()) {
                filters.push(`sort=popularity:desc`);
            } else if (this.state.sortingSelection.valueOf() === SortingOptionEnum.ReleaseDateAsc.valueOf()) {
                filters.push(`sort=release_date:asc`);
            } else if (this.state.sortingSelection.valueOf() === SortingOptionEnum.ReleaseDateDesc.valueOf()) {
                filters.push(`sort=release_date:desc`);
            } else if (this.state.sortingSelection.valueOf() === SortingOptionEnum.AlphabeticallyAsc.valueOf()) {
                filters.push(`sort=alphabetic:asc`);
            } else if (this.state.sortingSelection.valueOf() === SortingOptionEnum.AlphabeticallyDesc.valueOf()) {
                filters.push(`sort=alphabetic:desc`);
            }
        }

        queryString = queryString.concat(filters.join('&'));
        this.props.history.push(queryString);
    }

    onCoverClick(checked: boolean): void {
        this.setState({
            cover: checked
        });
    }

    onScreenshotsClick(checked: boolean): void {
        this.setState({
            screenshots: checked
        });
    }

    onTrailerClick(checked: boolean): void {
        this.setState({
            trailer: checked
        });
    }

    onSearchQueryChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchTerm: e.target.value });
    }

    onSearchKeypress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.props.history.push(`/games/search/filter/?query=${this.state.searchTerm}`);
        }
    }

    onPopularClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: checked,
            browseRecentSelected: false,
            browseUpcomingSelected: false,
            browseNewsSelected: false,
            disableNonBrowse: checked
        });

        if (checked) {
            this.props.history.push(`/games/search/filter/${GamesPresets.popular}`);
        }
    }

    onRecentClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: false,
            browseRecentSelected: checked,
            browseUpcomingSelected: false,
            browseNewsSelected: false,
            disableNonBrowse: checked
        });

        if (checked) {
            this.props.history.push(`/games/search/filter/${GamesPresets.recentlyReleased}`);
        }
    }

    onUpcomingClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: false,
            browseRecentSelected: false,
            browseUpcomingSelected: checked,
            browseNewsSelected: false,
            disableNonBrowse: checked
        });

        if (checked) {
            this.props.history.push(`/games/search/filter/${GamesPresets.upcoming}`);
        }
    }

    onNewsClick(checked: boolean): void {

        this.setState({
            browsePopularSelected: false,
            browseRecentSelected: false,
            browseUpcomingSelected: false,
            browseNewsSelected: checked,
            disableNonBrowse: checked
        });

        if (checked) {
            this.props.history.push(`/games/news`);
        }
    }

    render() {
        return (
            <Filter
                browsePopularSelected={this.state.browsePopularSelected}
                browseRecentSelected={this.state.browseRecentSelected}
                browseUpcomingSelected={this.state.browseUpcomingSelected}
                browseNewsSelected={this.state.browseNewsSelected}
                popularity={this.state.popularity}
                onPopularityChange={this.onPopularityChange}
                releaseDateStart={this.state.releaseDateStart}
                releaseDateEnd={this.state.releaseDateEnd}
                onReleaseDateStartChange={this.onReleaseDateStartChange}
                onReleaseDateEndChange={this.onReleaseDateEndChange}
                sortingOptions={this.state.sortingOptions}
                sortingSelection={this.state.sortingSelection}
                onSortingSelectionChange={this.onSortingSelectionChange}
                genreOptions={this.state.genreOptions}
                genresSelection={this.state.genresSelection}
                onGenresSelectionChange={this.onGenresSelectionChange}
                platformOptions={this.state.platformOptions}
                platformsSelection={this.state.platformsSelection}
                onPlatformSelectionChange={this.onPlatformSelectionChange}
                categoryOptions={this.state.categoryOptions}
                categorySelection={this.state.categorySelection}
                onCategorySelectionChange={this.onCategorySelectionChange}
                onRefreshClick={this.onRefreshClick}
                onCoverClick={this.onCoverClick}
                onScreenshotsClick={this.onScreenshotsClick}
                onTrailerClick={this.onTrailerClick}
                onSearchKeypress={this.onSearchKeypress}
                onSearchQueryChanged={this.onSearchQueryChanged}
                onPopularClick={this.onPopularClick}
                onRecentClick={this.onRecentClick}
                onUpcomingClick={this.onUpcomingClick}
                onNewsClick={this.onNewsClick}
                cover={this.state.cover}
                screenshots={this.state.screenshots}
                trailer={this.state.trailer}
                filterExpanded={this.props.filterExpanded}
                disableNonBrowse={this.state.disableNonBrowse}
            />
        );
    }

}

export default withRouter(FilterContainer);