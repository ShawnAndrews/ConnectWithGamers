import * as React from 'react';
import { GenreGame } from '../../../../client/client-server-common/common';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import Spinner from '../../spinner/main';

interface IGenreListProps {
    isLoading: boolean;
    genreName: string;
    genreGames: GenreGame[];
}

const GenreList: React.SFC<IGenreListProps> = (props: IGenreListProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center">
                <Spinner loadingMsg="Loading game..." />
            </div>
        );
    }

    return (
        <div>
            {props.genreName &&
                <div className="menu-game-table-header">
                    <strong>New and upcoming {props.genreName} games</strong>
                </div>}
            {props.genreGames && 
                props.genreGames
                .map((genreGame: GenreGame) => {
                    return <ThumbnailGameContainer key={genreGame.id} game={genreGame}/>;
                })}
        </div>
    );     

};

export default GenreList;