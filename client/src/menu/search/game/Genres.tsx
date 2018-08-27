import * as React from 'react';
import Button from '@material-ui/core/Button';

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
                        <span key={x}>
                            <Button variant="raised" className="menu-game-genres-name" onClick={() => { props.handleGenreClick(index); }}>
                                {x}
                            </Button>
                            {index !== (props.genres.length - 1) && ` , `}
                        </span>
                    );
                })}
        </div>
    );

};

export default Genres;