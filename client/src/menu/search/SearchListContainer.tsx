const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import SearchList from './SearchList';
import { SearchGamesResponse } from '../../../client-server-common/common';

export interface SearchGameOption {
    value: number;
    label: string;
}

interface ISearchListContainerProps extends RouteComponentProps<any> { }

class SearchListContainer extends React.Component<ISearchListContainerProps, any> {

    constructor(props: ISearchListContainerProps) {
        super(props);
        this.state = { rawInput: '', gameslist: [], isLoading: false, loadingMsg: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.loadGamesList = this.loadGamesList.bind(this);
        this.handleRawInputChange = this.handleRawInputChange.bind(this);
    }

    handleChange(selectedGame: any): void {
        this.props.history.push(`/menu/search/${selectedGame.value}`);
    }

    handleKeyDown(event: any): void {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (this.state.rawInput !== '') {
                this.loadGamesList(this.state.rawInput);
            }
        }
    }

    handleRawInputChange(newValue: string): string {
        this.setState({ rawInput: newValue });
        return newValue;
    }

    loadGamesList(query: string): void {

        this.setState({ isLoading: true });
        IGDBService.httpGetSearchGames(query)
            .then( (response: SearchGamesResponse) => {
                if (response.data) {
                    this.setState({ gameslist: response.data.map((x: any) => { return {value: x.id, label: x.name}; }), isLoading: false });
                } else {
                    this.setState({ gameslist: [], isLoading: false });
                }
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });

    }

    render() {
        return (
            <SearchList
                gameId={this.props.match.params.id}
                isLoading={this.state.isLoading}
                gameslist={this.state.gameslist}
                handleChange={this.handleChange}
                handleKeyDown={this.handleKeyDown}
                handleRawInputChange={this.handleRawInputChange}
            />
        );
    }

}

export default withRouter(SearchListContainer);