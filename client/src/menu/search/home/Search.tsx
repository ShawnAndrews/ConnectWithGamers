import * as React from 'react';
import GameContainer from '../game/GameContainer';
import SearchBarContainer from '../../searchbar/SearchBarContainer';

interface ISearchProps { }

const Search: React.SFC<ISearchProps> = (props: ISearchProps) => {

    return (
        <>
            <SearchBarContainer/>
            <GameContainer/>
        </>
    );

};

export default Search;