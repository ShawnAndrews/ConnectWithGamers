const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import UpcomingGameList from './UpcomingGameList';
import { UpcomingGameResponse, UpcomingGamesResponse } from '../../../../client/client-server-common/common';

interface IUpcomingGameListContainerProps extends RouteComponentProps<any> {
    count: number;
}

interface IUpcomingGameListContainerState {
    isLoading: boolean;
    upcomingGames: UpcomingGameResponse[];
    count: number;
}

class UpcomingGameListContainer extends React.Component<IUpcomingGameListContainerProps, IUpcomingGameListContainerState> {

    constructor(props: IUpcomingGameListContainerProps) {
        super(props);
        this.state = { 
            isLoading: true,
            upcomingGames: undefined,
            count: props.count
        };
        this.onClickGame = this.onClickGame.bind(this);
        this.loadUpcomingGames = this.loadUpcomingGames.bind(this);
        this.loadUpcomingGames();
    }

    loadUpcomingGames(): void {
        IGDBService.httpGetUpcomingGamesList()
            .then( (response: UpcomingGamesResponse) => {
                const upcomingGames: UpcomingGameResponse[] = response.data.slice(0, this.props.count);
                this.setState({ isLoading: false, upcomingGames: upcomingGames });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
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
        this.props.history.push(`/menu/search/${id}`);
    }

    render() {
        return (
            <UpcomingGameList
                isLoading={this.state.isLoading}
                upcomingGames={this.state.upcomingGames}
                formatUpcomingDate={this.formatUpcomingDate}
                onClickGame={this.onClickGame}
            />
        );
    }

}

export default withRouter(UpcomingGameListContainer);