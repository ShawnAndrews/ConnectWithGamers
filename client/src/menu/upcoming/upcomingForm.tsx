const popupS = require('popups');
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import UpcomingGame from './upcominggame';
import { ResponseModel, UpcomingGameResponse } from '../../../../client/client-server-common/common';

interface Game {
    name: string;
    imageUrl: string;

}

interface IUpcomingFormProps {
    history: any;
}

class UpcomingForm extends React.Component<IUpcomingFormProps, any> {

    constructor(props: IUpcomingFormProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadUpcomingGames = this.loadUpcomingGames.bind(this);
        this.loadUpcomingGames();
    }

    private loadUpcomingGames(): void {
        IGDBService.httpGetUpcomingGamesList()
            .then( (response: any) => {
                this.setState({ upcomingGames: response });
                console.log(`response data: ${response}`);
                const uniqueArray = function(arrArg: any) {
                    return arrArg.filter(function(elem: string, pos: number, arr: string[]) {
                        return arr.indexOf(elem) === pos;
                    });
                };
                const uniqueReleaseDates: string[] = uniqueArray(response.map((x: any) => { return x.next_release_date; }));
                console.log(`Unique release dates (${uniqueReleaseDates.length}): ${JSON.stringify(uniqueReleaseDates)}`);
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
            <div className="menu-game-table-container">
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
                                        return <UpcomingGame key={x.id} className="menu-game-table-game" upcomingGame={x}/>;
                                    })}
                                </div>
                            );
                        })}
                </div>
            </div>
        );       

    }

}

export default withRouter(UpcomingForm);