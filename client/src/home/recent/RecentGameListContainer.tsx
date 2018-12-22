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

    render() {
        return (
            <RecentGameList
                recentGames={this.state.recentGames}
                onClickGame={this.onClickGame}
                goToRedirectCallback={this.props.history.push}
            />
        );
    }

}

export default withRouter(RecentGameListContainer);