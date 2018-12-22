import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PredefinedGameResponse } from '../../../../client/client-server-common/common';
import RecentGameList from './RecentGameList';

interface IRecentGameListContainerProps extends RouteComponentProps<any> {
    recentGames: PredefinedGameResponse[];
}

interface IRecentGameListContainerState {
    recentGames: PredefinedGameResponse[];
}

class RecentGameListContainer extends React.Component<IRecentGameListContainerProps, IRecentGameListContainerState> {

    constructor(props: IRecentGameListContainerProps) {
        super(props);
        this.onClickGame = this.onClickGame.bind(this);
        
        this.state = { 
            recentGames: props.recentGames
        };
    }

    onClickGame(id: number): void {
        this.props.history.push(`/games/search/game/${id}`);
    }

    formatRecentlyReleasedDate(date: number): string {
        const CURRENT_UNIX_TIME_MS: number = parseInt(new Date().getTime().toString().slice(0, -3));
        const TARGET_UNIX_TIME_MS: number = new Date(date).getTime();
        let difference: number = CURRENT_UNIX_TIME_MS - TARGET_UNIX_TIME_MS;
        let hoursDifference: number = Math.floor(difference / 60 / 60);
        
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
                recentGames={this.state.recentGames}
                formatRecentlyReleasedDate={this.formatRecentlyReleasedDate}
                onClickGame={this.onClickGame}
                goToRedirectCallback={this.props.history.push}
            />
        );
    }

}

export default withRouter(RecentGameListContainer);