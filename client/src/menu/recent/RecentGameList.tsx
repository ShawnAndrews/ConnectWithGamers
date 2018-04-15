const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import Spinner from '../../spinner/main';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import { RecentGameResponse } from '../../../../client/client-server-common/common';

interface IRecentGameListProps {
    isLoading: boolean;
    recentGames: RecentGameResponse[];
    uniqueReleaseDates: string[];
}

const RecentGameList: React.SFC<IRecentGameListProps> = (props: IRecentGameListProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center">
                <Spinner loadingMsg="Loading game..." />
            </div>
        );
    }

    return (
        <div className="menu-game-table">
            {props.recentGames && 
                props.uniqueReleaseDates
                .map((uniqueReleaseDate: string) => {
                    return (
                        <div key={uniqueReleaseDate}>
                            <div className="menu-game-table-header">
                                <strong>{uniqueReleaseDate}</strong>
                            </div>
                            {props.recentGames
                            .filter((x: RecentGameResponse) => { return x.last_release_date === uniqueReleaseDate; } )
                            .map((x: RecentGameResponse) => {
                                return <ThumbnailGameContainer key={x.id} className="menu-game-table-game" game={x}/>;
                            })}
                        </div>
                    );
                })}
        </div>
    );   

};

export default RecentGameList;