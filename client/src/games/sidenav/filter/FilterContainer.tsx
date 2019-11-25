import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Filter from './Filter';
import { IdNamePair, GenericModelResponse, CurrencyType } from '../../../../client-server-common/common';
import { GlobalReduxState } from '../../../reducers/main';

export const MIN_PRICE_RANGE: number = 0;

export const MAX_PRICE_RANGE: number = 100;

export enum SortingOptionEnum {
    "None",
    "PriceAsc",
    "PriceDesc",
    "ReleaseDateAsc",
    "ReleaseDateDesc",
    "AlphabeticallyAsc",
    "AlphabeticallyDesc",
}

interface IFilterContainerProps extends RouteComponentProps<any> {
    
}

interface IFilterContainerState {
    searchTerm: string;
    priceRange: number[];
    releaseDateStart: Date;
    releaseDateEnd: Date;
    genreOptions: IdNamePair[];
    platformOptions: IdNamePair[];
    sortingOptions: IdNamePair[];
    sortingSelection: SortingOptionEnum;
    genresSelection: IdNamePair[];
    platformsSelection: IdNamePair[];
}

interface ReduxStateProps {
    currencyType: CurrencyType;
    currencyRate: number;
}

interface ReduxDispatchProps {

}

type Props = IFilterContainerProps & ReduxStateProps & ReduxDispatchProps;

class FilterContainer extends React.Component<Props, IFilterContainerState> {

    constructor(props: Props) {
        super(props);
        this.onPricesChange = this.onPricesChange.bind(this);
        this.onReleaseDateStartChange = this.onReleaseDateStartChange.bind(this);
        this.onReleaseDateEndChange = this.onReleaseDateEndChange.bind(this);
        this.onSortingSelectionChange = this.onSortingSelectionChange.bind(this);
        this.onGenresSelectionChange = this.onGenresSelectionChange.bind(this);
        this.onPlatformSelectionChange = this.onPlatformSelectionChange.bind(this);
        this.onRefreshClick = this.onRefreshClick.bind(this);
        this.onSearchQueryChanged = this.onSearchQueryChanged.bind(this);
        this.onSearchKeypress = this.onSearchKeypress.bind(this);
        this.loadGenres = this.loadGenres.bind(this);
        this.loadPlatforms = this.loadPlatforms.bind(this);

        const sortingOptions: IdNamePair[] = [
            { id: SortingOptionEnum.PriceAsc, name: 'Price ↑' },
            { id: SortingOptionEnum.PriceDesc, name: 'Price ↓' },
            { id: SortingOptionEnum.ReleaseDateAsc, name: 'Release Date ↑' },
            { id: SortingOptionEnum.ReleaseDateDesc, name: 'Release Date ↓' },
            { id: SortingOptionEnum.AlphabeticallyAsc, name: 'Alphabetical ↑' },
            { id: SortingOptionEnum.AlphabeticallyDesc, name: 'Alphabetical ↓' },
        ];

        this.loadGenres();
        this.loadPlatforms();

        this.state = {
            searchTerm: '',
            priceRange: [MIN_PRICE_RANGE, MAX_PRICE_RANGE],
            releaseDateStart: undefined,
            releaseDateEnd: undefined,
            genreOptions: [],
            platformOptions: [],
            sortingOptions: sortingOptions,
            sortingSelection: SortingOptionEnum.ReleaseDateDesc,
            genresSelection: [],
            platformsSelection: [],
        };
    }

    onPricesChange(event: any, newValue: number[]): void {
        this.setState({
            priceRange: newValue
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

    onRefreshClick(): void {
        let queryString: string = `/search/filter/?`;
        const filters: string[] = [];

        filters.push(`query=${this.state.searchTerm}`);

        if (this.state.releaseDateStart) {
            const timestamp: number = this.state.releaseDateStart.getTime();
            filters.push(`released_after=${timestamp}`);
        }

        if (this.state.releaseDateEnd) {
            const timestamp: number = this.state.releaseDateEnd.getTime();
            filters.push(`released_before=${timestamp}`);
        }

        if (this.state.priceRange) {
            filters.push(`price=${this.state.priceRange[0]},${this.state.priceRange[1]}`);
        }

        if (this.state.genresSelection.length > 0) {
            const genres: string = this.state.genresSelection.map((x: IdNamePair) => x.id).join();
            filters.push(`genres=${genres}`);
        }

        if (this.state.platformsSelection.length > 0) {
            const platforms: string = this.state.platformsSelection.map((x: IdNamePair) => x.id).join();
            filters.push(`platforms=${platforms}`);
        }

        if (this.state.sortingSelection) {
            
            if (this.state.sortingSelection.valueOf() === SortingOptionEnum.PriceAsc.valueOf()) {
                filters.push(`sort=price:asc`);
            } else if (this.state.sortingSelection.valueOf() === SortingOptionEnum.PriceDesc.valueOf()) {
                filters.push(`sort=price:desc`);
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

    loadGenres(): void {
        SteamService.httpGenericGetData<GenericModelResponse>(`/api/steam/genres`)
            .then( (response: GenericModelResponse) => {
                const genres: IdNamePair[] = response.data.slice(0, 12);

                this.setState({ genreOptions: genres });
            })
            .catch( (error: string) => {
                this.setState({ genreOptions: [] });
            });
    }

    loadPlatforms(): void {
        SteamService.httpGenericGetData<GenericModelResponse>(`/api/steam/platforms`)
            .then( (response: GenericModelResponse) => {
                const platforms: IdNamePair[] = response.data;

                this.setState({ platformOptions: platforms });
            })
            .catch( (error: string) => {
                this.setState({ platformOptions: [] });
            });
    }
    
    onSearchQueryChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ searchTerm: e.target.value });
    }

    onSearchKeypress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter`) {
            this.onRefreshClick();
        }
    }

    render() {
        return (
            <Filter
                priceRange={this.state.priceRange}
                onPricesChange={this.onPricesChange}
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
                onRefreshClick={this.onRefreshClick}
                onSearchKeypress={this.onSearchKeypress}
                onSearchQueryChanged={this.onSearchQueryChanged}
                currencyType={this.props.currencyType}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IFilterContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;

    return {
        currencyType: globalModalReduxState.topnav.currencyType,
        currencyRate: globalModalReduxState.topnav.currencyRate
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IFilterContainerProps): ReduxDispatchProps => ({

});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IFilterContainerProps>
    (mapStateToProps, mapDispatchToProps)(FilterContainer));