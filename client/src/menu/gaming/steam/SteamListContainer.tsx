const popupS = require('popups');
import * as React from 'react';
import * as AccountService from '../../../service/account/main';
import SteamList from './SteamList';
import { SteamIdResponse, SteamFriendsResponse, SteamFriend } from '../../../../../client/client-server-common/common';

export interface SteamFriendOption {
    value: number;
    label: string;
}

interface IThumbnailGameContainerProps { }

interface SteamListContainerState {
    isLoading: boolean;
    steamId: number;
    onlineFriends: SteamFriend[];
    offlineFriends: SteamFriend[];
    filter: string;
}

class SteamListContainer extends React.Component<IThumbnailGameContainerProps, SteamListContainerState> {

    constructor(props: any) {
        super(props);
        this.state = { 
            isLoading: true,
            steamId: undefined,
            onlineFriends: undefined,
            offlineFriends: undefined,
            filter: undefined
        };
        this.loadAccountSteamId = this.loadAccountSteamId.bind(this);
        this.goToSteamProfile = this.goToSteamProfile.bind(this);
        this.handleRawInputChange = this.handleRawInputChange.bind(this);
        this.loadAccountSteamId();
    }

    loadAccountSteamId(): void {
        AccountService.httpGetAccountSteamId()
            .then( (response: SteamIdResponse) => {
                const steamId: number = response.data ? response.data.steamId : undefined;

                AccountService.httpGetAccountSteamFriends()
                    .then( (response: SteamFriendsResponse) => {
                        let friends: SteamFriend[] = [];
                        if (!response.data) {
                            friends = undefined;
                        } else {
                            friends = response.data;
                        }
                        this.setState({ 
                            isLoading: false, 
                            steamId: steamId, 
                            onlineFriends: friends ? friends.filter((x: SteamFriend) => { return x.online; }) : undefined,
                            offlineFriends: friends ? friends.filter((x: SteamFriend) => { return !x.online; }) : undefined
                        });
                    })
                    .catch( (error: string) => {
                        popupS.modal({ content: `<div>• ${error}</div>` });
                    });

            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
            });
    }

    goToSteamProfile(link: string): void {
        const win = window.open(link, '_blank');
        win.focus();
    }

    handleRawInputChange(event: any): void {
        this.setState({ 
            filter: event.target.value !== "" ? event.target.value : undefined 
        });
    }

    render() {
        return (
            <SteamList
                isLoading={this.state.isLoading}
                steamId={this.state.steamId}
                onlineFriends={this.state.onlineFriends}
                offlineFriends={this.state.offlineFriends}
                goToSteamProfile={this.goToSteamProfile}
                handleRawInputChange={this.handleRawInputChange}
                filter={this.state.filter}
            />
        );
    }

}

export default SteamListContainer;