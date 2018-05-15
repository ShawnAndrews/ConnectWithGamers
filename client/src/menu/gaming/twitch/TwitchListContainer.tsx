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
                    let expanded: boolean[] = [];
                    if (!response.data) {
                        liveFollowers = undefined;
                    } else {
                        liveFollowers = response.data;
                        liveFollowers.forEach(() => {
                            expanded.push(false);
                        });
                    }
                    this.setState({ 
                        isLoading: false,
                        twitchId: twitchId,
                        liveFollowers: liveFollowers,
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
                onExpandClick={this.onExpandClick}
                expanded={this.state.expanded}
            />
        );
    }

}

export default withRouter(TwitchListContainer);