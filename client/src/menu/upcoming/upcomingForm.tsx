const popupS = require('popups');
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import Spinner from '../../loader/spinner';
import UpcomingGame from './upcominggame';
import { ResponseModel } from '../../../../client/client-server-common/common';

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
        this.state = { isLoading: false };
        this.loadUpcomingGames = this.loadUpcomingGames.bind(this);
        this.loadUpcomingGames();
    }

    private loadUpcomingGames(): void {
        this.setState({ isLoading: true });
        IGDBService.httpGetUpcomingGamesList()
            .then( (response: any) => {
                this.setState({ gameIds: response });
                console.log(`response data: ${response}`);
                this.setState({ isLoading: false });
            })
            .catch( (response: any) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                popupS.modal({ content: formattedErrors.join('') });
            });
    }

    render() {
        return (
            <ul className="menu-game-table">
                {this.state.gameIds && this.state.gameIds.map((x: string) => {
                    return ( 
                        <li key={x}>
                            <UpcomingGame gameId={x}/>
                        </li>);
                })}
            </ul>
        );       

    }

}

export default withRouter(UpcomingForm);