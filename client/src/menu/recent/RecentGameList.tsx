import * as React from 'react';
import Spinner from '../../spinner/main';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import { RecentGameResponse } from '../../../../client/client-server-common/common';

interface IRecentGameListProps {
    isLoading: boolean;
    recentGames: RecentGameResponse[];
    formatRecentlyReleasedDate: (date: number) => string;
    onClickGame: (id: number) => void;
}

const RecentGameList: React.SFC<IRecentGameListProps> = (props: IRecentGameListProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="middle" loadingMsg="Loading game..." />
        );
    }

    return (
        <div className="recently-released-table">
            <div className="recently-released-table-header">
                <a className="recently-released-table-header-link">Recently Released</a>
                <i className="fas fa-chevron-right"/>
            </div>
            {props.recentGames
            .map((x: RecentGameResponse) => {
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