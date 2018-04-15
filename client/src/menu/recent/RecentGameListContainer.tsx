const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter } from 'react-router-dom';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import { RecentGameResponse, RecentGamesResponse } from '../../../../client/client-server-common/common';
import RecentGameList from './RecentGameList';

class RecentGameListContainer extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { isLoading: true };
        this.loadRecentlyReleasedGames = this.loadRecentlyReleasedGames.bind(this);
        this.loadRecentlyReleasedGames();
    }

    loadRecentlyReleasedGames(): void {
        IGDBService.httpGetRecentlyReleasedGamesList()
            .then( (response: RecentGamesResponse) => {
                const recentGames: RecentGameResponse[] = response.data;
                const uniqueArray = function(arrArg: any) {
                    return arrArg.filter(function(elem: string, pos: number, arr: string[]) {
                        return arr.indexOf(elem) === pos;
                    });
                };
                const uniqueReleaseDates: string[] = uniqueArray(response.data.map((x: any) => { return x.last_release_date; }));
                this.setState({ isLoading: false, recentGames: recentGames, uniqueReleaseDates: uniqueReleaseDates });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
            });
    }

    render() {
        return (
            <RecentGameList
                isLoading={this.state.isLoading}
                recentGames={this.state.recentGames}
                uniqueReleaseDates={this.state.uniqueReleaseDates}
            />
        );
    }

}

export default withRouter(RecentGameListContainer);