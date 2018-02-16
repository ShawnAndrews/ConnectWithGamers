const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter } from 'react-router-dom';
import Spinner from '../../loader/spinner';
import { ResponseModel, GameResponse } from '../../../../client/client-server-common/common';

interface IUpcomingGameProps {
    history: any;

    gameId: string;
}

class UpcomingGame extends React.Component<IUpcomingGameProps, any> {

    constructor(props: IUpcomingGameProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadGame = this.loadGame.bind(this);
        this.loadGame(this.props.gameId);
    }

    private loadGame(id: string): void {
        console.log(`Loading new game #${this.props.gameId}...`);
        IGDBService.httpGetGame(id)
            .then( (response: GameResponse) => {
                this.setState({ isLoading: false, game: response });
            })
            .catch( (response: any) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                popupS.modal({ content: formattedErrors.join('') });
            });
    }

    render() {
        const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

        if (this.state.isLoading) {
            return (
                <div className="menu-grid-center">
                    <Spinner loadingMsg="Loading game..." />
                </div>
            );
        }
        
        return (
            <div className="menu-game">
                {this.state.game.cover && 
                    <img className="menu-game-cover" height="100%" width="100%" src={this.state.game.cover} alt="Game cover"/>}
            </div>
        );

    }

}

export default withRouter(UpcomingGame);