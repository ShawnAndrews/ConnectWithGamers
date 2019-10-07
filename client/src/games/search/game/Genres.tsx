import * as React from 'react';
import { IdNamePair } from '../../../../client-server-common/common';

interface IGenresProps {
    genres: IdNamePair[];
    handleGenreClick: (index: number) => void;
}

const Genres: React.SFC<IGenresProps> = (props: IGenresProps) => {

    return (
        <div className="genres color-secondary mt-2">
            <div className="title mb-2 mt-3">Genres</div>
            {props.genres && props.genres
                .map((x: IdNamePair, index: number) => {
                    return (
                        <React.Fragment key={x.id}>
                            <span 
                                className="genre cursor-pointer d-inline-block py-1 px-2 m-1" 
                                onClick={() => { props.handleGenreClick(index); }}
                            >
                                {x.name}
                            </span>
                        </React.Fragment>
                    );
                })
                .slice(0, 7)}
        </div>
    );

};

export default Genres;