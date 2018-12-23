import * as React from 'react';
import { GameResponse } from '../../../../client/client-server-common/common';
import { Card, CardMedia } from '@material-ui/core';

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
                <div className="popular-table-header mb-3 pt-2" onClick={() => { props.goToRedirectCallback(`/games/search/popular`); }}>
                    <a className="popular-table-header-link mr-2">Most Popular</a>
                    <i className="fas fa-chevron-right"/>
                </div>
                <div className="popular-table-horizontal" ref={props.listScrollRef} onMouseLeave={props.mouseLeave} onMouseMove={props.mouseMove} onMouseDown={props.mouseDown} onMouseUp={props.mouseUp}>
                    {props.popularGames
                        .map((x: GameResponse) => {
                            return (
                                <Card key={x.id} className="popular-table-container cursor-pointer custom-shadow d-inline-block mx-2" onClick={() => { props.onClickGame(x.id); }}>
                                    <CardMedia className="popular-table-image h-75 w-100">
                                        <img className="w-100 h-100" src={x.cover ? x.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                                    </CardMedia>
                                    <div className="hover-primary h-25">
                                        <div className="clear"/>
                                        <div className="name mx-1 text-center">
                                            {x.name}
                                        </div>
                                        <div className="row">
                                            <div className="col-8 genre pr-1">
                                                {x.genres[0].name}
                                            </div>
                                            {x.aggregated_rating &&
                                                <div className="col-4 rating p-0">
                                                    {Math.floor(x.aggregated_rating)}%
                                                </div>}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                </div>
                <div className="popular-table-arrow left" onClick={props.onScrollLeft}>
                    <i className="fas fa-2x fa-chevron-left"/>
                </div>
                <div className="popular-table-arrow right" onClick={props.onScrollRight}>
                    <i className="fas fa-2x fa-chevron-right"/>
                </div>
            </div>
        </div>
    );   

};

export default PopularGameList;