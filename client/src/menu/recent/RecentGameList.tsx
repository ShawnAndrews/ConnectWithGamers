import * as React from 'react';
import { PredefinedGameResponse } from '../../../../client/client-server-common/common';

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
                    <div key={x.id} className="recently-released-table-container" onClick={() => { props.onClickGame(x.id); }}>
                        <div className="recently-released-table-image">
                            <img src={x.cover ? x.cover : 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
                        </div>
                        <div className="recently-released-table-data-container">
                            <span className="name">{x.name}</span>
                            <span className="date">{props.formatRecentlyReleasedDate(x.first_release_date)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );   

};

export default RecentGameList;