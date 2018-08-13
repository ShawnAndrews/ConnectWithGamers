const popupS = require('popups');
import * as React from 'react';
import * as IGDBService from '../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import ThumbnailGameContainer from '../game/ThumbnailGameContainer';
import { RecentGameResponse, RecentGamesResponse } from '../../../../client/client-server-common/common';
import PlatformGameList from './PlatformGameList';
import { PlatformOption, platformOptions } from './PlatformListContainer';

export interface IPlatformMenuItem {
    imgSrc: string;
    platformOption: PlatformOption;
}

interface IPlatformGameListContainerProps extends RouteComponentProps<any> { }

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

        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/AtBFqav.jpg', platformOption: platformOptions[0] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/vRg9GYG.jpg', platformOption: platformOptions[1] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/2iodS5c.jpg', platformOption: platformOptions[2] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/pQWJdKQ.jpg', platformOption: platformOptions[3] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/5vl8BPm.jpg', platformOption: platformOptions[4] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/wHfr2Cd.jpg', platformOption: platformOptions[5] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/c38AfEV.jpg', platformOption: platformOptions[6] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/3a2sKKZ.jpg', platformOption: platformOptions[7] });

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