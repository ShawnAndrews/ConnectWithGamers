import * as Redux from 'redux';
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import ModalFilternav from './ModalFilternav';
import { toggleSearchModal } from '../../actions/main';
import { GlobalReduxState } from '../../reducers/main';

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
    query: string;
}

interface IModalFilternavContainerProps extends RouteComponentProps<any> {
    
}

interface IModalFilternavContainerState {
    categoryExpanded: boolean;
    popularityExpanded: boolean;
    genreExpanded: boolean;
    platformExpanded: boolean;
    filterOptions: FilterOptions;
    popularities: NameValuePair[];
    categories: NameValuePair[];
    genres: NameValuePair[];
    platforms: NameValuePair[];
}

interface ReduxStateProps {
    toggleSearch: boolean;
}

interface ReduxDispatchProps {
    toggleSearchModal: () => void;
}

type Props = IModalFilternavContainerProps & ReduxStateProps & ReduxDispatchProps;

const defaultFilterOptions: FilterOptions = {
    platformSelection: [false, false, false, false, false, false, false, false],
    genreSelection: [false, false, false, false, false, false, false, false, false, false],
    categorySelection: [false, false, false, false, false],
    popularitySelection: FilterPopularityOptions.Above0,
    query: ''
};

class ModalFilternavContainer extends React.Component<Props, IModalFilternavContainerState> {

    constructor(props: Props) {
        super(props);
        this.onPlatformExpandClick = this.onPlatformExpandClick.bind(this);
        this.onGenreExpandClick = this.onGenreExpandClick.bind(this);
        this.onPopularityExpandClick = this.onPopularityExpandClick.bind(this);
        this.onCategoryExpandClick = this.onCategoryExpandClick.bind(this);
        this.onFilterPopularityClick = this.onFilterPopularityClick.bind(this);
        this.onFilterCategoryClick = this.onFilterCategoryClick.bind(this);
        this.onFilterGenreClick = this.onFilterGenreClick.bind(this);
        this.onFilterPlatformClick = this.onFilterPlatformClick.bind(this);
        this.onQueryChanged = this.onQueryChanged.bind(this);
        this.onClearBtnClick = this.onClearBtnClick.bind(this);
        this.onSearchBtnClick = this.onSearchBtnClick.bind(this);

        this.state = {
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

    onPopularityExpandClick(): void {
        this.setState({ popularityExpanded: !this.state.popularityExpanded });
    }

    onCategoryExpandClick(): void {
        this.setState({ categoryExpanded: !this.state.categoryExpanded });
    }

    onGenreExpandClick(): void {
        this.setState({ genreExpanded: !this.state.genreExpanded });
    }

    onPlatformExpandClick(): void {
        this.setState({ platformExpanded: !this.state.platformExpanded });
    }

    onFilterPopularityClick(popularitySelection: number): void {
        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.popularitySelection = popularitySelection;
        this.setState({ filterOptions: filterOptions });
    }

    onFilterCategoryClick(categorySelection: number): void {
        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.categorySelection[categorySelection] = !filterOptions.categorySelection[categorySelection];
        this.setState({ filterOptions: filterOptions });
    }

    onFilterGenreClick(genreSelection: number): void {
        const filterOptions: FilterOptions = this.state.filterOptions;
        filterOptions.genreSelection[genreSelection] = !filterOptions.genreSelection[genreSelection];
        this.setState({ filterOptions: filterOptions });
    }

    onFilterPlatformClick(platformSelection: number): void {
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
        queryString = queryString.concat(params.join('&'));
        this.onClearBtnClick();
        this.props.toggleSearchModal();
        this.props.history.push(`/games/search/filter/${queryString}`);
    }

    get getDefaultFilterOptionsDeepCopy(): FilterOptions {
        const defaultFilterOptionsDeepCopy: FilterOptions = {...defaultFilterOptions};
        defaultFilterOptionsDeepCopy.genreSelection = defaultFilterOptions.genreSelection.slice();
        defaultFilterOptionsDeepCopy.platformSelection = defaultFilterOptions.platformSelection.slice();
        defaultFilterOptionsDeepCopy.categorySelection = defaultFilterOptions.categorySelection.slice();

        return defaultFilterOptionsDeepCopy;
    }

    render() {
        
        return (
            <ModalFilternav
                toggle={this.props.toggleSearch}
                onToggle={this.props.toggleSearchModal}
                popularityExpanded={this.state.popularityExpanded}
                categoryExpanded={this.state.categoryExpanded}
                genreExpanded={this.state.genreExpanded}
                platformExpanded={this.state.platformExpanded}
                onPopularityExpandClick={this.onPopularityExpandClick}
                onCategoryExpandClick={this.onCategoryExpandClick}
                onGenreExpandClick={this.onGenreExpandClick}
                onPlatformExpandClick={this.onPlatformExpandClick}
                filterOptions={this.state.filterOptions}
                onFilterPopularityClick={this.onFilterPopularityClick}
                onFilterCategoryClick={this.onFilterCategoryClick}
                onFilterGenreClick={this.onFilterGenreClick}
                onFilterPlatformClick={this.onFilterPlatformClick}
                onClearBtnClick={this.onClearBtnClick}
                onSearchBtnClick={this.onSearchBtnClick}
                onQueryChanged={this.onQueryChanged}
                popularities={this.state.popularities}
                categories={this.state.categories}
                genres={this.state.genres}
                platforms={this.state.platforms}
            />
        );
    }

}

const mapStateToProps = (state: any, ownProps: IModalFilternavContainerProps): ReduxStateProps => {
    const globalModalReduxState: GlobalReduxState = state;
    return {
        toggleSearch: globalModalReduxState.search.toggleSearch
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch, ownProps: IModalFilternavContainerProps): ReduxDispatchProps => ({
    toggleSearchModal: () => { dispatch(toggleSearchModal()); },
});

export default withRouter(connect<ReduxStateProps, ReduxDispatchProps, IModalFilternavContainerProps>
    (mapStateToProps, mapDispatchToProps)(ModalFilternavContainer));