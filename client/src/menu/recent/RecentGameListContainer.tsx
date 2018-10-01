const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { RecentGameResponse, RecentGamesResponse } from '../../../../client/client-server-common/common';
import RecentGameList from './RecentGameList';

interface IRecentGameListContainerProps extends RouteComponentProps<any> {
    count: number;
}

interface IRecentGameListContainerState {
    isLoading: boolean;
    recentGames: RecentGameResponse[];
    count: number;
}

class RecentGameListContainer extends React.Component<IRecentGameListContainerProps, IRecentGameListContainerState> {

    constructor(props: IRecentGameListContainerProps) {
        super(props);
        this.state = { 
            isLoading: true,
            recentGames: undefined,
            count: props.count
        };
        this.onClickGame = this.onClickGame.bind(this);
        this.loadRecentlyReleasedGames = this.loadRecentlyReleasedGames.bind(this);
        this.loadRecentlyReleasedGames();
    }

    loadRecentlyReleasedGames(): void {
        IGDBService.httpGetRecentlyReleasedGamesList()
            .then( (response: RecentGamesResponse) => {
                const recentGames: RecentGameResponse[] = response.data.slice(0, this.props.count);
                this.setState({ isLoading: false, recentGames: recentGames });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                this.setState({ isLoading: false });
            });
    }

    onClickGame(id: number): void {
        this.props.history.push(`/menu/search/${id}`);
    }

    formatRecentlyReleasedDate(date: number): string {
        const CURRENT_UNIX_TIME_MS: number = new Date().getTime();
        const TARGET_UNIX_TIME_MS: number = date;
        let difference: number = CURRENT_UNIX_TIME_MS - TARGET_UNIX_TIME_MS;
        let hoursDifference: number = Math.floor(difference / 1000 / 60 / 60);
        
        if (hoursDifference < 1) {
            return `1 hrs ago`; 
        } else if (hoursDifference < 24) {
            return `${hoursDifference} hrs ago`;
        } else {
            return `${Math.floor(hoursDifference / 24)} days ago`;
        }
    }

    render() {
        return (
            <RecentGameList
                isLoading={this.state.isLoading}
                recentGames={this.state.recentGames}
                formatRecentlyReleasedDate={this.formatRecentlyReleasedDate}
                onClickGame={this.onClickGame}
            />
        );
    }

}

export default withRouter(RecentGameListContainer);