const popupS = require('popups');
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import ThumbnailGame from '../thumbnailGame';
import { ResponseModel, UpcomingGameResponse, RecentGameResponse } from '../../../../client/client-server-common/common';

interface IRecentFormProps {
    history: any;
}

class RecentForm extends React.Component<IRecentFormProps, any> {

    constructor(props: IRecentFormProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadRecentlyReleasedGames = this.loadRecentlyReleasedGames.bind(this);
        this.loadRecentlyReleasedGames();
    }

    private loadRecentlyReleasedGames(): void {
        IGDBService.httpGetRecentlyReleasedGamesList()
            .then( (response: any) => {
                const uniqueArray = function(arrArg: any) {
                    return arrArg.filter(function(elem: string, pos: number, arr: string[]) {
                        return arr.indexOf(elem) === pos;
                    });
                };
                const uniqueReleaseDates: string[] = uniqueArray(response.map((x: any) => { return x.last_release_date; }));
                this.setState({ isLoading: false, upcomingGames: response, uniqueReleaseDates: uniqueReleaseDates });
            })
            .catch( (response: any) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                popupS.modal({ content: formattedErrors.join('') });
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

export default withRouter(RecentForm);