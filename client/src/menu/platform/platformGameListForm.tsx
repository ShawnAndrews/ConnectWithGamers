const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import { GenericResponseModel, DbPlatformGamesResponse, PlatformGame, PlatformGamesResponse } from '../../../../client/client-server-common/common';
import ThumbnailGame from '../thumbnailGame';
import Spinner from '../../loader/spinner';

export interface PlatformOption {
    id: number;
    name: string;
}

export const platformOptions: PlatformOption[] = [
    { id: 6,   name: 'Steam' },
    { id: 48,  name: 'Playstation 4' },
    { id: 49,  name: 'Xbox One' },
    { id: 130, name: 'Nintendo Switch' },
    { id: 9,   name: 'Playstation 3' },
    { id: 12,  name: 'Xbox 360' },
    { id: 18,  name: 'Nintendo 64' },
    { id: 37,  name: 'Nintendo 3DS' },
];

interface IPlatformGameListFormProps {
    match?: any;
}

class PlatformGameListForm extends React.Component<IPlatformGameListFormProps, any> {

    constructor(props: IPlatformGameListFormProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadPlatformGames = this.loadPlatformGames.bind(this);
        this.loadPlatformGames();
    }

    private loadPlatformGames(): void {
        const platformId: number = Number(this.props.match.params.id);
        IGDBService.httpGetPlatformGamesList(platformId)
            .then( (response: PlatformGamesResponse) => {
                const platformName: string = response.data.platformName;
                this.setState({ isLoading: false, platformName: platformName, platformGames: response.data.platformGames });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
    }

    render() {
        
        if (this.state.isLoading) {
            return (
                <div className="menu-grid-center">
                    <Spinner loadingMsg="Loading game..." />
                </div>
            );
        }

        return (
            <div>
                {this.state.platformName &&
                    <div className="menu-game-table-header">
                        <strong>Exclusive games for {this.state.platformName}</strong>
                    </div>}
                {this.state.platformGames && 
                    this.state.platformGames
                    .map((platformGame: PlatformGame) => {
                        return <ThumbnailGame key={platformGame.id} className="menu-game-table-game" game={platformGame}/>;
                    })}
            </div>
        );       

    }

}

export default PlatformGameListForm;