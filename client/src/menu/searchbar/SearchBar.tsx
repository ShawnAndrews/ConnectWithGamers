import * as React from 'react';
import Select from 'react-select';
import { SearchGameOption } from './SearchBarContainer';

interface ISearchBarProps {
    isLoading: boolean;
    gameslist: SearchGameOption[];
    handleChange: (selectedGame: any) => void;
    handleKeyDown: (event: any) => void;
    handleRawInputChange: (newValue: string) => string;
}

const SearchBar: React.SFC<ISearchBarProps> = (props: ISearchBarProps) => {

    return (
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
    );

};

export default SearchBar;