import * as React from 'react';
import Button from '@material-ui/core/Button';
import { IdNamePair, GenreEnums } from '../../../../client-server-common/common';

interface IGenresProps {
    genres: number[];
    handleGenreClick: (index: number) => void;
}

const Genres: React.SFC<IGenresProps> = (props: IGenresProps) => {

    return (
        <div className="genres color-secondary px-2 mt-2">
            <div className="title my-1">Genres</div>
            {props.genres && props.genres
                .map((x: number, index: number) => {
                    return (
                        <React.Fragment key={x}>
                            <Button variant="raised" className="genre hover-tertiary-solid m-2 py-1 px-2" onClick={() => { props.handleGenreClick(index); }}>
                                {GenreEnums[x]}
                            </Button>
                        </React.Fragment>
                    );
                })}
        </div>
    );

};

export default Genres;