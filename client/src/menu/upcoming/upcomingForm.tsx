const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import ThumbnailGame from '../thumbnailGame';
import { UpcomingGameResponse, UpcomingGamesResponse } from '../../../../client/client-server-common/common';

class UpcomingForm extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { isLoading: true };
        this.loadUpcomingGames = this.loadUpcomingGames.bind(this);
        this.loadUpcomingGames();
    }

    private loadUpcomingGames(): void {
        IGDBService.httpGetUpcomingGamesList()
            .then( (response: UpcomingGamesResponse) => {
                const uniqueArray = function(arrArg: any) {
                    return arrArg.filter(function(elem: string, pos: number, arr: string[]) {
                        return arr.indexOf(elem) === pos;
                    });
                };
                const uniqueReleaseDates: string[] = uniqueArray(response.data.map((x: any) => { return x.next_release_date; }));
                this.setState({ isLoading: false, upcomingGames: response.data, uniqueReleaseDates: uniqueReleaseDates });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
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
                                .filter((x: UpcomingGameResponse) => { return x.next_release_date === uniqueReleaseDate; } )
                                .map((x: UpcomingGameResponse) => {
                                    return <ThumbnailGame key={x.id} className="menu-game-table-game" game={x}/>;
                                })}
                            </div>
                        );
                    })}
            </div>
        );       

    }

}

export default UpcomingForm;