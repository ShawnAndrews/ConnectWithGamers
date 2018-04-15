const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as IGDBService from '../../service/igdb/main';
import { GenreOption } from './GenreGameListContainer';

interface IGenreGameListProps {
    genreMenuItems: GenreOption[];
    goToGenre: (genreId: number) => void;
}

const GenreGameList: React.SFC<IGenreGameListProps> = (props: IGenreGameListProps) => {

    return (
        <div>
            {props.genreMenuItems && props.genreMenuItems
                .map((x: GenreOption) => {
                    return (
                        <div key={x.id} className="menu-item" onClick={() => props.goToGenre(x.id)}>
                            <div className="menu-item-overlay"/>
                            <div className="menu-item-text">
                                {x.name}
                            </div>
                        </div>
                    );
                })}
        </div>
    );

};

export default GenreGameList;