import * as Redux from 'redux';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SwipeState } from '../../../client-server-common/common';
import { MenuReduxState } from '../../reducers/main';
import { connect } from 'react-redux';
import Filternav from './Filternav';
import { swipeRightFilter } from '../../actions/main';

export interface NameValuePair {
    name: string;
    value: number;
}

export enum FilterPlatformOptions {
    PC = 6,
    PS4 = 48,
    XboxOne = 49,
    Switch = 130,
    PS3 = 9,
    Xbox360 = 12,
    N64 = 18,
    Nintendo3DS = 37
}

export enum FilterGenreOptions {
    RealTimeStategy = 11,
    RolePlayingGame = 12,
    Adventure = 31,
    Shooter = 5,
    TurnBasedStategy = 16,
    Platformer = 8,
    Indie = 32,
    Racing = 10,
    Sport = 14,
    Simulator = 13
}

export enum FilterCategoryOptions {
    MainGame,
    DLC,
    Expansion,
    Bundle,
    StandaloneExpansion
}

export enum FilterSortState {
    Asce,
    Desc
}

export enum FilterSortOptions {
    Alphabetically,
    ReleaseDate,
    Popularity
}

export enum FilterPopularityOptions {
    Above0,
    Above20,
    Above40,
    Above60,
    Above80
}

export interface FilterOptions {
    platformSelection: boolean[];
    genreSelection: boolean[];
    categorySelection: boolean[];
    popularitySelection: FilterPopularityOptions;
    sortSelection: FilterSortOptions;
    sortState: FilterSortState[];
    query: string;
}

interface IFilternavContainerProps extends RouteComponentProps<any> { }

interface IFilternavContainerState {
    swipeState: SwipeState;
    filterMouseMoved: boolean;
    filterNavRef: React.RefObject<HTMLDivElement>;
    filterNavWidth: number;
    oldTouchPosY: number;
    sortExpanded: boolean;
    categoryExpanded: boolean;
    popularityExpanded: boolean;
    genreExpanded: boolean;
    platformExpanded: boolean;
    filterOptions: FilterOptions;
    sorts: NameValuePair[];
    popularities: NameValuePair[];
    categories: NameValuePair[];
    genres: NameValuePair[];
    platforms: NameValuePair[];
}

interface ReduxStateProps {
    swipeState: SwipeState;
    filterNavWidth: number;
}

interface ReduxDispatchProps {
    swipeRight: () => void;
}

type Props = IFilternavContainerProps & ReduxStateProps & ReduxDispatchProps;

const defaultFilterOptions: FilterOptions = {
    platformSelection: [false, false, false, false, false, false, false, false],
    genreSelection: [false, false, false, false, false, false, false, false, false, false],
    categorySelection: [false, false, false, false, false],
    popularitySelection: FilterPopularityOptions.Above0,
    sortSelection: FilterSortOptions.ReleaseDate,
    sortState: [FilterSortState.Asce, FilterSortState.Desc, FilterSortState.Asce],
    query: ''
};

class FilternavContainer extends React.Component<Props, IFilternavContainerState> {

    constructor(props: Props) {
        super(props);
        this.updateNavPosition = this.updateNavPosition.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onSortExpandClick = this.onSortExpandClick.bind(this);
        this.onPlatformExpandClick = this.onPlatformExpandClick.bind(this);
        this.onGenreExpandClick = this.onGenreExpandClick.bind(this);
        this.onPopularityExpandClick = this.onPopularityExpandClick.bind(this);
        this.onCategoryExpandClick = this.onCategoryExpandClick.bind(this);
        this.onSortSelectionClick = this.onSortSelectionClick.bind(this);
        this.onFilterPopularityClick = this.onFilterPopularityClick.bind(this);
        this.onFilterCategoryClick = this.onFilterCategoryClick.bind(this);
        this.onFilterGenreClick = this.onFilterGenreClick.bind(this);
        this.onFilterPlatformClick = this.onFilterPlatformClick.bind(this);
        this.onQueryChanged = this.onQueryChanged.bind(this);
        this.onClearBtnClick = this.onClearBtnClick.bind(this);
        this.onSearchBtnClick = this.onSearchBtnClick.bind(this);
        const filterNavRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

        this.state = { 
            filterMouseMoved: false,
            filterNavRef: filterNavRef,
            swipeState: props.swipeState,
            filterNavWidth: props.filterNavWidth,
            oldTouchPosY: undefined,
            sortExpanded: false,
            categoryExpanded: false,
            popularityExpanded: false,
            genreExpanded: false,
            platformExpanded: false,
            filterOptions: this.getDefaultFilterOptionsDeepCopy,
            platforms: [
                { name: 'PC', value: FilterPlatformOptions.PC },
                { name: 'PS4', value: FilterPlatformOptions.PS4 },
                { name: 'Xbox One', value: FilterPlatformOptions.XboxOne },
                { name: 'Switch', value: FilterPlatformOptions.Switch },
                { name: 'PS3', value: FilterPlatformOptions.PS3 },
                { name: 'Xbox 360', value: FilterPlatformOptions.Xbox360 },
                { name: 'N64', value: FilterPlatformOptions.N64 },
                { name: 'Nintendo 3DS', value: FilterPlatformOptions.Nintendo3DS },
            ],
            genres: [
                { name: 'Real Time Strategy', value: FilterGenreOptions.RealTimeStategy },
                { name: 'Role Playing Game', value: FilterGenreOptions.RolePlayingGame },
                { name: 'Adventure', value: FilterGenreOptions.Adventure },
                { name: 'Shooter', value: FilterGenreOptions.Shooter },
                { name: 'Turn Based Strategy', value: FilterGenreOptions.TurnBasedStategy },
                { name: 'Platformer', value: FilterGenreOptions.Platformer },
                { name: 'Indie', value: FilterGenreOptions.Indie },
                { name: 'Racing', value: FilterGenreOptions.Racing },
                { name: 'Sport', value: FilterGenreOptions.Sport },
                { name: 'Simulator', value: FilterGenreOptions.Simulator }
            ],
            sorts: [
                { name: 'Alphabetically', value: FilterSortOptions.Alphabetically },
                { name: 'Release date', value: FilterSortOptions.ReleaseDate },
                { name: 'Popularity', value: FilterSortOptions.Popularity }
            ],
            categories: [
                { name: 'Main game', value: FilterCategoryOptions.MainGame }, 
                { name: 'DLC', value: FilterCategoryOptions.DLC }, 
                { name: 'Expansion', value: FilterCategoryOptions.Expansion }, 
                { name: 'Bundle', value: FilterCategoryOptions.Bundle }, 
                { name: 'Standalone expansion', value: FilterCategoryOptions.StandaloneExpansion }
            ],
            popularities: [
                { name: 'Above 0%', value: FilterPopularityOptions.Above0 },
                { name: 'Above 20%', value: FilterPopularityOptions.Above20 },
                { name: 'Above 40%', value: FilterPopularityOptions.Above40 },
                { name: 'Above 60%', value: FilterPopularityOptions.Above60 },
                { name: 'Above 80%', value: FilterPopularityOptions.Above80 }, 
            ],
        };
    }

    componentDidMount(): void {
        this.updateNavPosition(this.state.swipeState, this.state.filterNavWidth);
    }

    componentWillReceiveProps(newProps: Props): void {
        this.updateNavPosition(newProps.swipeState, newProps.filterNavWidth);
    }

    updateNavPosition(swipeState: SwipeState, filterNavWidth: number): void {
        const divNode: HTMLDivElement = this.state.filterNavRef.current;
        let newFilterPosition: number;

        if (swipeState === SwipeState.Middle) {
            newFilterPosition = -filterNavWidth;
        } else {
            newFilterPosition = 0;
        }
        divNode.style.right = `${newFilterPosition}px`;
    }

    onTouchStart(e: React.TouchEvent<HTMLDivElement>): void {
        const newMousePosY: number = e.nativeEvent.touches[0].pageY;
        this.setState({ oldTouchPosY: newMousePosY });
    }

    onTouchMove(e: React.TouchEvent<HTMLDivElement>): void {
        const oldMousePosY: number = this.state.oldTouchPosY;
        const newMousePosY: number = e.nativeEvent.touches[0].pageY;
        const delta: number = oldMousePosY - newMousePosY;
        const deltaArtificialScalar: number = 1.5;
        let filterScrollContainer: Element = document.getElementsByClassName("filternav-items-container")[0];
        filterScrollContainer.scrollTop += delta * deltaArtificialScalar;
        this.setState({ oldTouchPosY: newMousePosY, filterMouseMoved: true });
    }

    onSortExpandClick(): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        this.setState({ sortExpanded: !this.state.sortExpanded });
    }

    onPopularityExpandClick(): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        this.setState({ popularityExpanded: !this.state.popularityExpanded });
    }

    onCategoryExpandClick(): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        this.setState({ categoryExpanded: !this.state.categoryExpanded });
    }

    onGenreExpandClick(): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        this.setState({ genreExpanded: !this.state.genreExpanded });
    }

    onPlatformExpandClick(): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        this.setState({ platformExpanded: !this.state.platformExpanded });
    }

    onSortSelectionClick(sortSelection: number): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.sortSelection = sortSelection;
        if (filterOptions.sortState[sortSelection] === FilterSortState.Asce) {
            filterOptions.sortState[sortSelection] = FilterSortState.Desc;
        } else {
            filterOptions.sortState[sortSelection] = FilterSortState.Asce;
        }
        this.setState({ filterOptions: filterOptions });
    }

    onFilterPopularityClick(popularitySelection: number): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.popularitySelection = popularitySelection;
        this.setState({ filterOptions: filterOptions });
    }

    onFilterCategoryClick(categorySelection: number): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.categorySelection[categorySelection] = !filterOptions.categorySelection[categorySelection];
        this.setState({ filterOptions: filterOptions });
    }

    onFilterGenreClick(genreSelection: number): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.genreSelection[genreSelection] = !filterOptions.genreSelection[genreSelection];
        this.setState({ filterOptions: filterOptions });
    }

    onFilterPlatformClick(platformSelection: number): void {
        if (this.state.filterMouseMoved === true) {
            this.setState({ filterMouseMoved: false });
            return;
        }
        this.setState({ filterMouseMoved: false });

        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.platformSelection[platformSelection] = !filterOptions.platformSelection[platformSelection];
        this.setState({ filterOptions: filterOptions });
    }

    onQueryChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.query = event.currentTarget.value;
        this.setState({ filterOptions: filterOptions });
    } 

    onClearBtnClick(): void {
        this.setState({ filterOptions: this.getDefaultFilterOptionsDeepCopy });
    }

    onSearchBtnClick(): void {
        let queryString: string = '?';
        const params: string[] = [];
        if (this.state.filterOptions.query !== '') {
            params.push(`query=${this.state.filterOptions.query}`);
        }
        if (this.state.filterOptions.platformSelection.find((x: boolean) => x === true)) {
            const platforms: string = 
                this.state.filterOptions.platformSelection
                    .map((x: boolean, index: number) => {
                        if (x) {
                            return this.state.platforms[index].value;
                        }
                    })
                    .filter((x: number) => { return x !== undefined; })
                    .join(',');
            params.push(`platforms=${platforms}`);
        }
        if (this.state.filterOptions.genreSelection.find((x: boolean) => x === true)) {
            const genres: string = 
                this.state.filterOptions.genreSelection
                    .map((x: boolean, index: number) => {
                        if (x) {
                            return this.state.genres[index].value;
                        }
                    })
                    .filter((x: number) => { return x !== undefined; })
                    .join(',');
            params.push(`genres=${genres}`);
        }
        if (this.state.filterOptions.categorySelection.find((x: boolean) => x === true)) {
            const categories: string = 
                this.state.filterOptions.categorySelection
                    .map((x: boolean, index: number) => {
                        if (x) {
                            return this.state.categories[index].value;
                        }
                    })
                    .filter((x: number) => { return x !== undefined; })
                    .join(',');
            params.push(`categories=${categories}`);
        }
        if (this.state.filterOptions.popularitySelection !== FilterPopularityOptions.Above0) {
            if (this.state.filterOptions.popularitySelection === FilterPopularityOptions.Above20) {
                params.push(`popularity=20`);
            } else if (this.state.filterOptions.popularitySelection === FilterPopularityOptions.Above40) {
                params.push(`popularity=40`);
            } else if (this.state.filterOptions.popularitySelection === FilterPopularityOptions.Above60) {
                params.push(`popularity=60`);
            } else if (this.state.filterOptions.popularitySelection === FilterPopularityOptions.Above80) {
                params.push(`popularity=80`);
            } 
        }
        if (this.state.filterOptions.sortSelection === FilterSortOptions.Alphabetically) {
            if (this.state.filterOptions.sortState[0] === FilterSortState.Asce) {
                params.push(`sort=alphabetically-aesc`);
            } else {
                params.push(`sort=alphabetically-desc`);
            }
        } else if (this.state.filterOptions.sortSelection === FilterSortOptions.ReleaseDate) {
            if (this.state.filterOptions.sortState[1] === FilterSortState.Asce) {
                params.push(`sort=releasedate-aesc`);
            } else {
                params.push(`sort=releasedate-desc`);
            }
        } else {
            if (this.state.filterOptions.sortState[2] === FilterSortState.Asce) {
                params.push(`sort=popularity-aesc`);
            } else {
                params.push(`sort=popularity-desc`);
            }
        }
        queryString = queryString.concat(params.join('&'));
        this.props.swipeRight();
        this.props.history.push(`/menu/search/filter/${queryString}`);
    }

    get getDefaultFilterOptionsDeepCopy(): FilterOptions {
        const defaultFilterOptionsDeepCopy: FilterOptions = {...defaultFilterOptions};
        defaultFilterOptionsDeepCopy.sortState = new Array(defaultFilterOptionsDeepCopy.sortState.length).fill(0);
        defaultFilterOptionsDeepCopy.genreSelection = new Array(defaultFilterOptionsDeepCopy.genreSelection.length).fill(false);
        defaultFilterOptionsDeepCopy.platformSelection = new Array(defaultFilterOptionsDeepCopy.platformSelection.length).fill(false);
        defaultFilterOptionsDeepCopy.categorySelection = new Array(defaultFilterOptionsDeepCopy.categorySelection.length).fill(false);

        return defaultFilterOptionsDeepCopy;
    }

    render() {
        
        return (
            <Filternav
                filterMouseMoved={this.state.filterMouseMoved}
                filterNavRef={this.state.filterNavRef}
                sortExpanded={this.state.sortExpanded}
                popularityExpanded={this.state.popularityExpanded}
                categoryExpanded={this.state.categoryExpanded}
                genreExpanded={this.state.genreExpanded}
                platformExpanded={this.state.platformExpanded}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onSortExpandClick={this.onSortExpandClick}
                onPopularityExpandClick={this.onPopularityExpandClick}
                onCategoryExpandClick={this.onCategoryExpandClick}
                onGenreExpandClick={this.onGenreExpandClick}
                onPlatformExpandClick={this.onPlatformExpandClick}
                filterOptions={this.state.filterOptions}
                onSortSelectionClick={this.onSortSelectionClick}
                onFilterPopularityClick={this.onFilterPopularityClick}
                onFilterCategoryClick={this.onFilterCategoryClick}
                onFilterGenreClick={this.onFilterGenreClick}
                onFilterPlatformClick={this.onFilterPlatformClick}
                onClearBtnClick={this.onClearBtnClick}
                onSearchBtnClick={this.onSearchBtnClick}
                onQueryChanged={this.onQueryChanged}
                sorts={this.state.sorts}
                popularities={this.state.popularities}
                categories={this.state.categories}
                genres={this.state.genres}
                platforms={this.state.platforms}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IFilternavContainerProps): ReduxStateProps => {
    const menuReduxState: MenuReduxState = state.menu;
    return {
        swipeState: menuReduxState.swipeStateFilter,
        filterNavWidth: menuReduxState.filterNavWidth
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IFilternavContainerProps): ReduxDispatchProps => ({
    swipeRight: () => { dispatch(swipeRightFilter()); }
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IFilternavContainerProps>
    (mapStateToProps, mapDispatchToProps)(FilternavContainer));