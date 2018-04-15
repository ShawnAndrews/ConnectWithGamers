const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter } from 'react-router-dom';
import PlatformList from './PlatformList';
import { GenericResponseModel, DbPlatformGamesResponse, PlatformGame, PlatformGamesResponse } from '../../../../client/client-server-common/common';

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

interface IPlatformListContainerProps {
    match?: any;
}

class PlatformListContainer extends React.Component<IPlatformListContainerProps, any> {

    constructor(props: IPlatformListContainerProps) {
        super(props);
        this.state = { isLoading: true };
        this.loadPlatformGames = this.loadPlatformGames.bind(this);
        this.loadPlatformGames();
    }

    loadPlatformGames(): void {
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
        return (
            <PlatformList
                isLoading={this.state.isLoading}
                platformName={this.state.platformName}
                platformGames={this.state.platformGames}
            />
        );
    }

}

export default withRouter(PlatformListContainer);