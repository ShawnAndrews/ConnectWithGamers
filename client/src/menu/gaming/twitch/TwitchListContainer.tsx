const popupS = require('popups');
import * as React from 'react';
import * as AccountService from '../../../service/account/main';
import { withRouter } from 'react-router-dom';
import TwitchList from './TwitchList';
import { TwitchUser, TwitchIdResponse, TwitchFollowersResponse } from '../../../../../client/client-server-common/common';

export interface TwitchUserOption {
    value: number;
    label: string;
}

interface ITwitchListContainerProps {
    history: any;
}

class TwitchListContainer extends React.Component<ITwitchListContainerProps, any> {

    constructor(props: ITwitchListContainerProps) {
        super(props);
        this.state = { isLoading: true };
        this.goToTwitchProfile = this.goToTwitchProfile.bind(this);
        this.handleRawInputChange = this.handleRawInputChange.bind(this);
        this.onVideoClick = this.onVideoClick.bind(this);
        this.onChatClick = this.onChatClick.bind(this);
        this.onBothClick = this.onBothClick.bind(this);
        this.onExpandClick = this.onExpandClick.bind(this);
        this.loadAccountTwitchFollowers = this.loadAccountTwitchFollowers.bind(this);
        this.loadAccountTwitchFollowers();
    }

    loadAccountTwitchFollowers(): void {
        AccountService.httpGetAccountTwitchId()
            .then( (response: TwitchIdResponse) => {
                const twitchId: number = response.data ? response.data.twitchId : undefined;

                AccountService.httpGetAccountTwitchFollowers()
                .then( (response: TwitchFollowersResponse) => {
                    let liveFollowers: TwitchUser[] = [];
                    let showVideo: boolean[] = [];
                    let showChat: boolean[] = [];
                    let showBoth: boolean[] = [];
                    let expanded: boolean[] = [];
                    if (!response.data) {
                        liveFollowers = undefined;
                    } else {
                        liveFollowers = response.data;
                        liveFollowers.forEach(() => {
                            showVideo.push(false);
                            showChat.push(false);
                            showBoth.push(false);
                            expanded.push(false);
                        });
                    }
                    this.setState({ 
                        isLoading: false,
                        twitchId: twitchId,
                        liveFollowers: liveFollowers,
                        showVideo: showVideo,
                        showChat: showChat,
                        showBoth: showBoth,
                        expanded: expanded
                    });
                })
                .catch( (error: string) => {
                    popupS.modal({ content: `Server is busy. Please try again later.` });
                    this.props.history.push(`/menu/gaming`);
                });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `Server is busy. Please try again later.` });
                this.props.history.push(`/menu/gaming`);
            });
    }

    goToTwitchProfile(link: string): void {
        const win = window.open(link, '_blank');
        win.focus();
    }

    handleRawInputChange(event: any): void {
        this.setState({ filter: event.target.value !== "" ? event.target.value : undefined });
    }

    onVideoClick(index: number): void {
        const showVideo: boolean[] = this.state.showVideo;
        const showChat: boolean[] = this.state.showChat;
        const showBoth: boolean[] = this.state.showBoth;
        showVideo[index] = !this.state.showVideo[index];
        showChat[index] = false;
        showBoth[index] = false;
        this.setState({ showVideo: showVideo, showChat: showChat, showBoth: showBoth });
    }

    onChatClick(index: number): void {
        const showVideo: boolean[] = this.state.showVideo;
        const showChat: boolean[] = this.state.showChat;
        const showBoth: boolean[] = this.state.showBoth;
        showVideo[index] = false;
        showChat[index] = !this.state.showChat[index];
        showBoth[index] = false;
        this.setState({ showVideo: showVideo, showChat: showChat, showBoth: showBoth });
    }

    onBothClick(index: number): void {
        const showVideo: boolean[] = this.state.showVideo;
        const showChat: boolean[] = this.state.showChat;
        const showBoth: boolean[] = this.state.showBoth;
        showVideo[index] = false;
        showChat[index] = false;
        showBoth[index] = !this.state.showBoth[index];
        this.setState({ showVideo: showVideo, showChat: showChat, showBoth: showBoth });
    }

    onExpandClick(index: number): void {
        const expanded: boolean[] = this.state.expanded;
        expanded[index] = !this.state.expanded[index];
        this.setState({ expanded: expanded });
    }

    render() {
        return (
            <TwitchList
                isLoading={this.state.isLoading}
                twitchId={this.state.twitchId}
                liveFollowers={this.state.liveFollowers}
                goToTwitchProfile={this.goToTwitchProfile}
                handleRawInputChange={this.handleRawInputChange}
                filter={this.state.filter}
                onVideoClick={this.onVideoClick}
                onChatClick={this.onChatClick}
                onBothClick={this.onBothClick}
                onExpandClick={this.onExpandClick}
                showVideo={this.state.showVideo}
                showChat={this.state.showChat}
                showBoth={this.state.showBoth}
                expanded={this.state.expanded}
            />
        );
    }

}

export default withRouter(TwitchListContainer);