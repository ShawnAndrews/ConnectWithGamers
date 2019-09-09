import * as React from 'react';
import { SteamGenreEnums } from '../../../../client-server-common/common';

interface IGenresProps {
    genres: number[];
    handleGenreClick: (index: number) => void;
}

const Genres: React.SFC<IGenresProps> = (props: IGenresProps) => {

    return (
        <div className="genres color-secondary mt-2">
            <span className="title my-1">{`Genres: `}</span>
            {props.genres && props.genres
                .map((x: number, index: number) => {
                    return (
                        <React.Fragment key={x}>
                            <span 
                                className="genre cursor-pointer d-inline-block py-1" 
                                onClick={() => { props.handleGenreClick(index); }}
                            >
                                {SteamGenreEnums[x]}
                            </span>
                        </React.Fragment>
                    );
                })
                .reduce((accu: any, elem: any) => {
                    return accu === null ? [elem] : [...accu, <span>{`, `}</span>, elem]
                }, null)}
        </div>
    );

};

export default Genres;