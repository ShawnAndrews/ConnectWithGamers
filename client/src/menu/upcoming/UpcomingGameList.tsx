import * as React from 'react';
import { PredefinedGameResponse } from '../../../../client/client-server-common/common';

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
                    <div key={x.id} className="upcoming-table-container" onClick={() => { props.onClickGame(x.id); }}>
                        <div className="upcoming-table-image">
                            <img src={x.cover ? x.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                        </div>
                        <div className="upcoming-table-data-container">
                            <span className="name">{x.name}</span>
                            <span className="date">{props.formatUpcomingDate(x.first_release_date)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );       

};

export default UpcomingGameList;