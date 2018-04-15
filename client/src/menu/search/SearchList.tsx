const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import Spinner from '../../spinner/main';
import { SearchGameOption } from './SearchListContainer';
import GameContainer from './GameContainer';

interface ISearchListProps {
    gameId: string;
    isLoading: boolean;
    gameslist: SearchGameOption[];
    handleChange: (selectedGame: any) => void;
    handleKeyDown: (event: any) => void;
    handleRawInputChange: (newValue: string) => void;
}

const SearchList: React.SFC<ISearchListProps> = (props: ISearchListProps) => {

    return (
        <div className="inherit">
            <Select
                name="gameslist"
                className="searchbar"
                optionClassName="searchbar"
                isLoading={props.isLoading}
                onChange={props.handleChange}
                options={props.gameslist}
                onInputKeyDown={props.handleKeyDown}
                onInputChange={props.handleRawInputChange}
                noResultsText="Enter query to return a list of games"
                placeholder="Search..."
            />
            <GameContainer
                gameId={props.gameId} 
            />
        </div>
    );

};

export default SearchList;