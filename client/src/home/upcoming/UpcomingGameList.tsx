import * as React from 'react';
import { GameResponse, GamesPresets } from '../../../../client/client-server-common/common';
import { CardMedia } from '@material-ui/core';
import { formatDate } from '../../util/main';

interface IUpcomingGameListProps {
    listScrollRef: React.RefObject<HTMLDivElement>;
    upcomingGames: GameResponse[];
    onClickGame: (id: number) => void;
    goToRedirectCallback: (URL: string) => void;
    onScrollLeft: () => void;
    onScrollRight: () => void;
    mouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void;
    mouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
    mouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    mouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const UpcomingGameList: React.SFC<IUpcomingGameListProps> = (props: IUpcomingGameListProps) => {

    return (
        <div className="upcoming-table w-100 mb-3 p-0">
            <div className="upcoming-table-header position-relative mb-3" onClick={() => { props.goToRedirectCallback(`/games/search/upcoming`); }}>
                <a className="mr-2">Upcoming</a>
                <i className="fas fa-chevron-right"/>
            </div>

            <div className="table-horizontal position-relative">
                <div className="scroll-horizontal" ref={props.listScrollRef} onMouseLeave={props.mouseLeave} onMouseMove={props.mouseMove} onMouseDown={props.mouseDown} onMouseUp={props.mouseUp}>
                    {props.upcomingGames
                        .map((x: GameResponse) => {
                            return (
                                <div key={x.id} className="table-container cursor-pointer align-top primary-shadow d-inline-block mx-2" onClick={() => { props.onClickGame(x.id); }}>
                                    <CardMedia className="position-relative h-100">
                                        <img className="h-100" src={x.cover ? x.cover.url : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                                        <div className="overlay" />
                                        <span className="name-overlay">{x.name}</span>
                                        <div className="icons">
                                            {x.linkIcons && 
                                                x.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} icon mr-1`}/>; })}
                                        </div>
                                        <span className="date pr-3 pl-1">{formatDate(x.first_release_date, false)}</span>
                                    </CardMedia>
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
    );       

};

export default UpcomingGameList;