const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as IGDBService from '../../service/igdb/main';
import { GenreListResponse, GenrePair } from '../../../client-server-common/common';
import GenreGameList from './GenreGameList';

export interface GenreOption {
    id: number;
    name: string;
}

interface IGenreGameListContainerProps {
    history: any;
}

class GenreGameListContainer extends React.Component<IGenreGameListContainerProps, any> {

    constructor(props: IGenreGameListContainerProps) {
        super(props);
        this.goToGenre = this.goToGenre.bind(this);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.setDefaultState();
        this.loadGenres();
    }

    setDefaultState(): void {
        const genreURL: string = '/menu/genre';
        this.state = {isLoading: true, genreURL: genreURL};
    }

    loadGenres(): void {
        IGDBService.httpGetGenreList()
            .then( (response: GenreListResponse) => {
                this.setState({ isLoading: false, genreMenuItems: response.data });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
    } 

    goToGenre(genreId: number): void {
        this.props.history.push(`${this.state.genreURL}/${genreId}`);
    }

    render() {
        return (
            <GenreGameList
                genreMenuItems={this.state.genreMenuItems}
                goToGenre={this.goToGenre}
            />
        );
    }

}

export default withRouter(GenreGameListContainer);