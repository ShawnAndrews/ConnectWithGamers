import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import UpcomingGameList from './UpcomingGameList';
import { PredefinedGameResponse } from '../../../../client/client-server-common/common';

interface IUpcomingGameListContainerProps extends RouteComponentProps<any> {
    upcomingGames: PredefinedGameResponse[];
}

interface IUpcomingGameListContainerState {
    upcomingGames: PredefinedGameResponse[];
}

class UpcomingGameListContainer extends React.Component<IUpcomingGameListContainerProps, IUpcomingGameListContainerState> {

    constructor(props: IUpcomingGameListContainerProps) {
        super(props);
        this.onClickGame = this.onClickGame.bind(this);
        
        this.state = { 
            upcomingGames: props.upcomingGames
        };
    }

    onClickGame(id: number): void {
        this.props.history.push(`/games/search/game/${id}`);
    }

    render() {
        return (
            <UpcomingGameList
                upcomingGames={this.state.upcomingGames}
                onClickGame={this.onClickGame}
                goToRedirectCallback={this.props.history.push}
            />
        );
    }

}

export default withRouter(UpcomingGameListContainer);