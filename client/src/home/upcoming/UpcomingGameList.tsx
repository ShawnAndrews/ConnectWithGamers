import * as React from 'react';
import { GameResponse } from '../../../../client/client-server-common/common';
import { Card, CardMedia } from '@material-ui/core';
import { formatDate } from '../../util/main';

interface IUpcomingGameListProps {
    upcomingGames: GameResponse[];
    onClickGame: (id: number) => void;
    goToRedirectCallback: (URL: string) => void;
}

const UpcomingGameList: React.SFC<IUpcomingGameListProps> = (props: IUpcomingGameListProps) => {

    return (
        <div className="upcoming-table col-6 col-xs-12 col-sm-6 py-0">
            <div className="upcoming-table-header position-relative" onClick={() => { props.goToRedirectCallback(`/games/upcoming`); }}>
                <a className="mr-2">Upcoming</a>
                <i className="fas fa-chevron-right"/>
            </div>
            {props.upcomingGames
            .map((x: GameResponse) => {
                return (
                    <Card key={x.id} className="upcoming-table-container primary-shadow row mt-2 mx-0" onClick={() => { props.onClickGame(x.id); }}>
                        <CardMedia className="col-4 p-0 h-100">
                            <img className="h-100 w-100" src={x.cover ? x.cover.url : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                        </CardMedia>
                        <div className="hover-primary col-8 pl-2">
                            <span className="name">{x.name}</span>
                            <div className="icons">
                                {x.linkIcons && 
                                    x.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} icon mr-1`}/>; })}
                            </div>
                            <span className="date">{formatDate(x.first_release_date, false)}</span>
                        </div>
                    </Card>
                );
            })}
        </div>
    );       

};

export default UpcomingGameList;