import * as React from 'react';
import Button from '@material-ui/core/Button';
import { IdNamePair } from '../../../../client-server-common/common';

interface IGenresProps {
    genres: IdNamePair[];
    handleGenreClick: (index: number) => void;
}

const Genres: React.SFC<IGenresProps> = (props: IGenresProps) => {

    if (!props.genres) {
        return null;
    }

    return (
        <div className="genres mt-2">
            <div className="title">Genres</div>
            {props.genres
                .map((x: IdNamePair, index: number) => {
                    return (
                        <React.Fragment key={x.id}>
                            <Button variant="raised" className="genre mx-1 py-1 px-2" onClick={() => { props.handleGenreClick(index); }}>
                                {x.name}
                            </Button>
                        </React.Fragment>
                    );
                })}
        </div>
    );

};

export default Genres;