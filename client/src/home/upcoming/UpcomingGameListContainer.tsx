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

    formatUpcomingDate(date: number): string {
        const CURRENT_UNIX_TIME_MS: number = new Date().getTime();
        const TARGET_UNIX_TIME_MS: number = date;
        let difference: number = TARGET_UNIX_TIME_MS - CURRENT_UNIX_TIME_MS;
        let hoursDifference: number = Math.floor(difference / 1000 / 60 / 60);
        
        if (hoursDifference < 1) {
            return `in 1 hrs `; 
        } else if (hoursDifference < 24) {
            return `in ${hoursDifference} hrs`;
        } else {
            return `in ${Math.floor(hoursDifference / 24)} days`;
        }
    }

    onClickGame(id: number): void {
        this.props.history.push(`/games/search/game/${id}`);
    }

    render() {
        return (
            <UpcomingGameList
                upcomingGames={this.state.upcomingGames}
                formatUpcomingDate={this.formatUpcomingDate}
                onClickGame={this.onClickGame}
                goToRedirectCallback={this.props.history.push}
            />
        );
    }

}

export default withRouter(UpcomingGameListContainer);