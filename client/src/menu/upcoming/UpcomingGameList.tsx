import * as React from 'react';
import Spinner from '../../spinner/main';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import { UpcomingGameResponse } from '../../../../client/client-server-common/common';

interface IUpcomingGameListProps {
    isLoading: boolean;
    upcomingGames: UpcomingGameResponse[];
    uniqueReleaseDates: string[];
}

const UpcomingGameList: React.SFC<IUpcomingGameListProps> = (props: IUpcomingGameListProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center">
                <Spinner loadingMsg="Loading game..." />
            </div>
        );
    }

    return (
        <div className="menu-game-table">
            {props.upcomingGames && 
                props.uniqueReleaseDates
                .map((uniqueReleaseDate: string) => {
                    return (
                        <div key={uniqueReleaseDate}>
                            <div className="menu-game-table-header">
                                <strong>{uniqueReleaseDate}</strong>
                            </div>
                            {props.upcomingGames
                            .filter((x: UpcomingGameResponse) => { return x.next_release_date === uniqueReleaseDate; } )
                            .map((x: UpcomingGameResponse) => {
                                return <ThumbnailGameContainer key={x.id} game={x}/>;
                            })}
                        </div>
                    );
                })}
        </div>
    );       

};

export default UpcomingGameList;