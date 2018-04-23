import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

interface IGenresProps {
    genres: string[];
    handleGenreClick: (index: number) => void;
}

const Genres: React.SFC<IGenresProps> = (props: IGenresProps) => {

    if (!props.genres) {
        return null;
    }

    return (
        <div className="menu-game-genres">
            <h2 className="menu-game-genres-header">Genres</h2>
            {props.genres
                .map((x: string, index: number) => {
                    return (
                        <span key={x}><RaisedButton className="menu-game-genres-name" label={x} onClick={() => { props.handleGenreClick(index); }}/>{index !== (props.genres.length - 1) && ` , `}</span>
                    );
                })}
        </div>
    );

};

export default Genres;