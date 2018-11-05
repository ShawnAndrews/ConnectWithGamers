import * as React from 'react';
import { PredefinedGameResponse } from '../../../../client/client-server-common/common';
import { Card, CardMedia } from '@material-ui/core';

interface IRecentGameListProps {
    recentGames: PredefinedGameResponse[];
    formatRecentlyReleasedDate: (date: number) => string;
    onClickGame: (id: number) => void;
    goToRedirectCallback: (URL: string) => void;
}

const RecentGameList: React.SFC<IRecentGameListProps> = (props: IRecentGameListProps) => {

    return (
        <div className="recently-released-table">
            <div className="recently-released-table-header" onClick={() => { props.goToRedirectCallback(`/menu/search/recent`); }}>
                <a className="recently-released-table-header-link">Recently Released</a>
                <i className="fas fa-chevron-right"/>
            </div>
            {props.recentGames
            .map((x: PredefinedGameResponse) => {
                return (
                    <Card key={x.id} className="recently-released-table-container" onClick={() => { props.onClickGame(x.id); }}>
                        <CardMedia className="recently-released-table-image">
                            <img src={x.cover ? x.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                        </CardMedia>
                        <div className="recently-released-table-data-container">
                            <span className="name">{x.name}</span>
                            <div className="icons">
                                {x.linkIcons && 
                                    x.linkIcons.map((platformIcon: string, index: number) => { return <i key={index} className={`${platformIcon} icon`}/>; })}
                            </div>
                            <span className="date">{props.formatRecentlyReleasedDate(x.first_release_date)}</span>
                        </div>
                    </Card>
                );
            })}
        </div>
    );   

};

export default RecentGameList;