const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter } from 'react-router-dom';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import { RecentGameResponse, RecentGamesResponse } from '../../../../client/client-server-common/common';
import PlatformGameList from './PlatformGameList';
import { PlatformOption, platformOptions } from './PlatformListContainer';

export interface IPlatformMenuItem {
    imgSrc: string;
    platformOption: PlatformOption;
}

interface IPlatformGameListContainerProps {
    history: any;
}

class PlatformGameListContainer extends React.Component<IPlatformGameListContainerProps, any> {

    constructor(props: IPlatformGameListContainerProps) {
        super(props);
        this.goToPlatform = this.goToPlatform.bind(this);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.setDefaultState();
    }

    setDefaultState(): void {
        const platformMenuItems: IPlatformMenuItem[] = [];
        const platformURL: string = '/menu/platform';

        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/1vDwtju.png', platformOption: platformOptions[0] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/FUaI1r1.png', platformOption: platformOptions[1] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/CFu1lX1.png', platformOption: platformOptions[2] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/dPd4Tqc.png', platformOption: platformOptions[3] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/aaEcKiz.png', platformOption: platformOptions[4] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/IM1Tliy.png', platformOption: platformOptions[5] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/E2RrnNw.png', platformOption: platformOptions[6] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/Hgco6Gy.png', platformOption: platformOptions[7] });

        this.state = {platformURL: platformURL, platformMenuItems: platformMenuItems};
    }

    goToPlatform(platformId: number): void {
        this.props.history.push(`${this.state.platformURL}/${platformId}`);
    }

    render() {
        return (
            <PlatformGameList
                platformMenuItems={this.state.platformMenuItems}
                goToPlatform={this.goToPlatform}
            />
        );
    }

}

export default withRouter(PlatformGameListContainer);