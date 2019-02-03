import * as React from 'react';
import { GameResponse, GamesPresets, GenreEnums } from '../../../../../client/client-server-common/common';
import { CardMedia } from '@material-ui/core';

interface IPopularGameListProps {
    popularGames: GameResponse[];
    onClickGame: (id: number) => void;
    listScrollRef: React.RefObject<HTMLDivElement>;
    onScrollLeft: () => void;
    onScrollRight: () => void;
    goToRedirectCallback: (URL: string) => void;
    mouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void;
    mouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    mouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    mouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const PopularGameList: React.SFC<IPopularGameListProps> = (props: IPopularGameListProps) => {

    return (
        <div className="col-md-12 col-lg-9 px-md-0 pl-lg-3">
            <div className="popular-table">
                <div className="popular-table-header mb-3 pt-2" onClick={() => { props.goToRedirectCallback(`/search/filter/${GamesPresets.popular}`); }}>
                    <a className="popular-table-header-link mr-2">Most Popular</a>
                    <i className="fas fa-chevron-right"/>
                </div>
                <div className="table-horizontal position-relative">
                    <div className="scroll-horizontal" ref={props.listScrollRef} onMouseLeave={props.mouseLeave} onMouseMove={props.mouseMove} onMouseDown={props.mouseDown} onMouseUp={props.mouseUp}>
                        {props.popularGames
                            .map((x: GameResponse) => {
                                return (
                                    <div key={x.id} className="table-container popular cursor-pointer primary-shadow d-inline-block mx-2" onClick={() => { props.onClickGame(x.id); }}>
                                        <CardMedia className="h-75 w-100">
                                            <img className="w-100 h-100" src={x.cover ? x.cover.url : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                                        </CardMedia>
                                        <div className="hover-primary h-25">
                                            <div className="clear"/>
                                            <div className="name mx-1 text-center">
                                                {x.name}
                                            </div>
                                            <div className="row">
                                                {x.genres &&
                                                    <div className="col-8 genre pr-0">
                                                        {GenreEnums[x.genres[0]]}
                                                    </div>}
                                                {x.aggregated_rating &&
                                                    <div className={`col-${x.genres ? 4 : 12} rating pl-0`}>
                                                        {Math.floor(x.aggregated_rating)}%
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                    <div className="table-arrow left" onClick={props.onScrollLeft}>
                        <i className="fas fa-2x fa-chevron-left"/>
                    </div>
                    <div className="table-arrow right" onClick={props.onScrollRight}>
                        <i className="fas fa-2x fa-chevron-right"/>
                    </div>
                </div>
            </div>
        </div>
    );   

};

export default PopularGameList;