const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import * as IGDBService from '../../service/igdb/main';
import { GenericResponseModel, PlatformGameResponse } from '../../../../client/client-server-common/common';
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
            .then( (response: any) => {
                const platform: PlatformOption = platformOptions.find((x: PlatformOption) => { console.log(`${typeof x.id} === ${typeof platformId}`); return x.id === platformId; });
                this.setState({ isLoading: false, platform: platform, platformGames: response });
            })
            .catch( (response: any) => {
                const formattedErrors: string[] = response.errors.map((errorMsg: string) => { return `<div>• ${errorMsg}</div>`; });
                popupS.modal({ content: formattedErrors.join('') });
            });
    }

    render() {
        console.log(`RERENDERING GAMELIST: ${JSON.stringify(this.state)}`);
        
        if (this.state.isLoading) {
            return (
                <div className="menu-grid-center">
                    <Spinner loadingMsg="Loading game..." />
                </div>
            );
        }

        return (
            <div>
                {this.state.platform &&
                    <div className="menu-game-table-header">
                        <strong>Most popular games for {this.state.platform.name}</strong>
                    </div>}
                {this.state.platformGames && 
                    this.state.platformGames
                    .map((platformGame: PlatformGameResponse) => {
                        return <ThumbnailGame key={platformGame.id} className="menu-game-table-game" game={platformGame}/>;
                    })}
            </div>
        );       

    }

}

export default PlatformGameListForm;