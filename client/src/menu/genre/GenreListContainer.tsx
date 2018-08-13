const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GenreGamesResponse } from '../../../../client/client-server-common/common';
import GenreList from './GenreList';

interface IGenreListContainerProps extends RouteComponentProps<any> { } 

class GenreListContainer extends React.Component<IGenreListContainerProps, any> {

    constructor(props: IGenreListContainerProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadGenreGames = this.loadGenreGames.bind(this);
        this.loadGenreGames();
    }

    loadGenreGames(): void {
        const genreId: number = Number(this.props.match.params.id);
        IGDBService.httpGetGenreGamesList(genreId)
            .then( (response: GenreGamesResponse) => {
                const genreName: string = response.data.genreName;
                this.setState({ isLoading: false, genreName: genreName, genreGames: response.data.genreGames });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
    }

    render() {
        return (
            <GenreList
                isLoading={this.state.isLoading}
                genreName={this.state.genreName}
                genreGames={this.state.genreGames}
            />
        );
    }

}

export default withRouter(GenreListContainer);