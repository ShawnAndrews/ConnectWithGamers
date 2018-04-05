const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import { GenericResponseModel, DbPlatformGamesResponse, PlatformGame, PlatformGamesResponse, GenreGamesResponse, GenreGame } from '../../../../client/client-server-common/common';
import ThumbnailGame from '../thumbnailGame';
import Spinner from '../../loader/spinner';

interface IGenreGameListFormProps {
    match?: any;
}

class GenreGameListForm extends React.Component<IGenreGameListFormProps, any> {

    constructor(props: IGenreGameListFormProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadGenreGames = this.loadGenreGames.bind(this);
        this.loadGenreGames();
    }

    private loadGenreGames(): void {
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
        
        if (this.state.isLoading) {
            return (
                <div className="menu-grid-center">
                    <Spinner loadingMsg="Loading game..." />
                </div>
            );
        }

        return (
            <div>
                {this.state.genreName &&
                    <div className="menu-game-table-header">
                        <strong>New and upcoming {this.state.genreName} games</strong>
                    </div>}
                {this.state.genreGames && 
                    this.state.genreGames
                    .map((genreGame: GenreGame) => {
                        return <ThumbnailGame key={genreGame.id} className="menu-game-table-game" game={genreGame}/>;
                    })}
            </div>
        );       

    }

}

export default GenreGameListForm;