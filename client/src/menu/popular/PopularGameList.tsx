import * as React from 'react';
import Spinner from '../../spinner/main';
import { PopularGameResponse } from '../../../../client/client-server-common/common';

interface IPopularGameListProps {
    isLoading: boolean;
    popularGames: PopularGameResponse[];
    onClickGame: (id: number) => void;
    listScrollRef: React.RefObject<HTMLDivElement>;
    onScrollLeft: () => void;
    onScrollRight: () => void;
}

const PopularGameList: React.SFC<IPopularGameListProps> = (props: IPopularGameListProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="middle" loadingMsg="Loading game..." />
        );
    }

    return (
        <div className="popular-table">
            <div className="popular-table-header">
                <a className="popular-table-header-link">Most Popular</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <div className="popular-table-horizontal" ref={props.listScrollRef}>
                {props.popularGames
                    .map((x: PopularGameResponse) => {
                        return (
                            <div key={x.id} className="popular-table-container" onClick={() => { props.onClickGame(x.id); }}>
                                <div className="popular-table-image">
                                    <img src={x.cover ? x.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                                </div>
                                <div className="popular-table-text-container">
                                    <div className="clear"/>
                                    <div className="name">
                                        {x.name}
                                    </div>
                                    <div className="genre">
                                        {x.genre}
                                    </div>
                                    {x.aggregated_rating &&
                                        <div className="rating">
                                            {Math.floor(x.aggregated_rating)}%
                                        </div>}
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className="popular-table-horizontal-arrow left" onClick={props.onScrollLeft}>
                <i className="fas fa-2x fa-chevron-left"/>
            </div>
            <div className="popular-table-horizontal-arrow right" onClick={props.onScrollRight}>
                <i className="fas fa-2x fa-chevron-right"/>
            </div>
        </div>
    );   

};

export default PopularGameList;