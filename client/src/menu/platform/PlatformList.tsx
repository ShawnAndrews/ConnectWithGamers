const popupS = require('popups');
import * as React from 'react';
import Select from 'react-select';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import Spinner from '../../spinner/main';
import { PlatformGame } from '../../../../client/client-server-common/common';

interface IPlatformListProps {
    isLoading: boolean;
    platformName: string;
    platformGames: PlatformGame[];
}

const PlatformList: React.SFC<IPlatformListProps> = (props: IPlatformListProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center">
                <Spinner loadingMsg="Loading game..." />
            </div>
        );
    }

    return (
        <div>
            {props.platformName &&
                <div className="menu-game-table-header">
                    <strong>Exclusive games for {props.platformName}</strong>
                </div>}
            {props.platformGames && 
                props.platformGames
                .map((platformGame: PlatformGame) => {
                    return <ThumbnailGameContainer key={platformGame.id} className="menu-game-table-game" game={platformGame}/>;
                })}
        </div>
    );   

};

export default PlatformList;