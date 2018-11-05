import * as React from 'react';
import { PredefinedGameResponse } from '../../../../client/client-server-common/common';
import { Card, CardMedia } from '@material-ui/core';

interface IUpcomingGameListProps {
    upcomingGames: PredefinedGameResponse[];
    formatUpcomingDate: (date: number) => string;
    onClickGame: (id: number) => void;
    goToRedirectCallback: (URL: string) => void;
}

const UpcomingGameList: React.SFC<IUpcomingGameListProps> = (props: IUpcomingGameListProps) => {

    return (
        <div className="upcoming-table">
            <div className="upcoming-table-header" onClick={() => { props.goToRedirectCallback(`/menu/search/upcoming`); }}>
                <a className="upcoming-table-header-link">Upcoming</a>
                <i className="fas fa-chevron-right"/>
            </div>
            {props.upcomingGames
            .map((x: PredefinedGameResponse) => {
                return (
                    <Card key={x.id} className="upcoming-table-container" onClick={() => { props.onClickGame(x.id); }}>
                        <CardMedia className="upcoming-table-image">
                            <img src={x.cover ? x.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                        </CardMedia>
                        <div className="upcoming-table-data-container">
                            <span className="name">{x.name}</span>
                            <div className="icons">
                                {x.linkIcons && 
                                    x.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} icon`}/>; })}
                            </div>
                            <span className="date">{props.formatUpcomingDate(x.first_release_date)}</span>
                        </div>
                    </Card>
                );
            })}
        </div>
    );       

};

export default UpcomingGameList;