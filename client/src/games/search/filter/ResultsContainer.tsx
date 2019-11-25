const popupS = require('popups');
import * as React from 'react';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse } from '../../../../client-server-common/common';
import Results from './Results';
import { SortingOptionEnum } from '../../sidenav/filter/FilterContainer';

interface IResultsContainerProps extends RouteComponentProps<any> {
    getConvertedPrice: (price: number) => string;
}

interface IResultsContainerState {
    isLoading: boolean;
    searchQuery: string;
    games: GameResponse[];
    sortingSelection: SortingOptionEnum;
    currentPage: number;
}

class ResultsContainer extends React.Component<IResultsContainerProps, IResultsContainerState> {

    constructor(props: IResultsContainerProps) {
        super(props);
        this.loadSearchGames = this.loadSearchGames.bind(this);
        this.onSortingSelectionChange = this.onSortingSelectionChange.bind(this);
        this.onChangePage = this.onChangePage.bind(this);

        const searchQuery: string = props.location.search;
        this.loadSearchGames(searchQuery);

        this.state = {
            isLoading: true,
            searchQuery: searchQuery,
            games: undefined,
            sortingSelection: SortingOptionEnum.ReleaseDateDesc,
            currentPage: 1
        };
    }

    componentWillReceiveProps(newProps: IResultsContainerProps): void {
        const newSearchQuery: string = newProps.location.search;

        if ( this.state.searchQuery != newSearchQuery) {

            this.setState({
                isLoading: true,
                searchQuery: newSearchQuery,
                games: undefined,
                sortingSelection: SortingOptionEnum.None,
            }, () => this.loadSearchGames(newSearchQuery));
        }
    }

    onSortingSelectionChange(event: any): void {
        this.setState({
            sortingSelection: event.target.value
        });
    }

    loadSearchGames(queryString: string): void {
        
        SteamService.httpGenericGetData<MultiGameResponse>(`/api/steam/games/query/${queryString}`)
            .then( (response: MultiGameResponse) => {
                const games: GameResponse[] = response.data;
                this.setState({ isLoading: false, games: games });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false});
            });
            
    }

    onChangePage(page: number, pageSize: number): void {
        this.setState({ currentPage: page });
    }

    render() {
        return (
            <Results
                isLoading={this.state.isLoading}
                games={this.state.games}
                onChangePage={this.onChangePage}
                currentPage={this.state.currentPage}
                getConvertedPrice={this.props.getConvertedPrice}
            />
        );
    }

}

export default withRouter(ResultsContainer);