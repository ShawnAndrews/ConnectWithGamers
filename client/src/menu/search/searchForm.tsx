const popupS = require('popups');
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import { ResponseModel } from '../../../../client/client-server-common/common';
import Game from '../search/game';

interface Game {
    name: string;
    imageUrl: string;

}

interface ISearchFormProps {
    history: any;
    match?: any;
}

class SearchForm extends React.Component<ISearchFormProps, any> {

    constructor(props: ISearchFormProps) {
        super(props);
        this.state = { rawInput: '', gameslist: [], isLoading: false, loadingMsg: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.loadGamesList = this.loadGamesList.bind(this);
        this.handleRawInputChange = this.handleRawInputChange.bind(this);
        console.log(`Routed id: #${this.props.match.params.id}`);
    }

    private handleChange(selectedGame: any) {
        console.log(`Input changed to ${JSON.stringify(selectedGame)}`);
        this.props.history.push(`/menu/search/${selectedGame.value}`);
    }

    private handleKeyDown(event: any) {
        if (event.keyCode === 13) {
            if (this.state.rawInput !== '') {
                this.loadGamesList(this.state.rawInput);
            }
        }
    }

    private handleRawInputChange(newValue: string) {
        this.setState({ rawInput: newValue });
    }

    private loadGamesList(query: string): void {

        this.setState({ isLoading: true });
        IGDBService.httpGetSearchGames(query)
            .then( (response: any) => {
                if (response) {
                    this.setState({ gameslist: response.map((x: any) => { return {value: x.id, label: x.name}; }), isLoading: false });
                } else {
                    this.setState({ gameslist: [], isLoading: false });
                }
            })
            .catch( (response: any) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                popupS.modal({ content: formattedErrors.join('') });
            });

    }

    render() {
        return (
            <div>
                <Select
                    name="gameslist"
                    className="searchbar"
                    optionClassName="searchbar"
                    isLoading={this.state.isLoading}
                    onChange={this.handleChange}
                    options={this.state.gameslist}
                    onInputKeyDown={this.handleKeyDown}
                    onInputChange={this.handleRawInputChange}
                    noResultsText="Enter query to return a list of games"
                    placeholder="Search..."
                />
                <Game
                    gameId={this.props.match.params.id} 
                />
            </div>
        );

    }

}

export default withRouter(SearchForm);