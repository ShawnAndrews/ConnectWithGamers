const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter } from 'react-router-dom';
import UpcomingGameList from './UpcomingGameList';
import { UpcomingGameResponse, UpcomingGamesResponse } from '../../../../client/client-server-common/common';

interface IUpcomingGameListContainerProps {
    history: any;
}

class UpcomingGameListContainer extends React.Component<IUpcomingGameListContainerProps, any> {

    constructor(props: IUpcomingGameListContainerProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadUpcomingGames = this.loadUpcomingGames.bind(this);
        this.loadUpcomingGames();
    }

    loadUpcomingGames(): void {
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
        return (
            <UpcomingGameList
                isLoading={this.state.isLoading}
                upcomingGames={this.state.upcomingGames}
                uniqueReleaseDates={this.state.uniqueReleaseDates}
            />
        );
    }

}

export default withRouter(UpcomingGameListContainer);