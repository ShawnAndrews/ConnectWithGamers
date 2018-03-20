const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import ThumbnailGame from '../thumbnailGame';
import { UpcomingGameResponse, RecentGameResponse, RecentGamesResponse } from '../../../../client/client-server-common/common';
import { AnyTypeAnnotation } from 'babel-types';

class RecentForm extends React.Component<any, any> {

    constructor(props: AnyTypeAnnotation) {
        super(props);
        this.state = { isLoading: true };
        this.loadRecentlyReleasedGames = this.loadRecentlyReleasedGames.bind(this);
        this.loadRecentlyReleasedGames();
    }

    private loadRecentlyReleasedGames(): void {
        IGDBService.httpGetRecentlyReleasedGamesList()
            .then( (response: RecentGamesResponse) => {
                const uniqueArray = function(arrArg: any) {
                    return arrArg.filter(function(elem: string, pos: number, arr: string[]) {
                        return arr.indexOf(elem) === pos;
                    });
                };
                const uniqueReleaseDates: string[] = uniqueArray(response.data.map((x: any) => { return x.last_release_date; }));
                this.setState({ isLoading: false, upcomingGames: response.data, uniqueReleaseDates: uniqueReleaseDates });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
            });
    }

    render() {

        if (this.state.isLoading) {
            return (
                <div className="menu-grid-center">
                    <Spinner loadingMsg="Loading game..." />
                </div>
            );
        }

        return (
            <div className="menu-game-table">
                {this.state.upcomingGames && 
                    this.state.uniqueReleaseDates
                    .map((uniqueReleaseDate: string) => {
                        return (
                            <div key={uniqueReleaseDate}>
                                <div className="menu-game-table-header">
                                    <strong>{uniqueReleaseDate}</strong>
                                </div>
                                {this.state.upcomingGames
                                .filter((x: RecentGameResponse) => { return x.last_release_date === uniqueReleaseDate; } )
                                .map((x: RecentGameResponse) => {
                                    return <ThumbnailGame key={x.id} className="menu-game-table-game" game={x}/>;
                                })}
                            </div>
                        );
                    })}
            </div>
        );       

    }

}

export default RecentForm;