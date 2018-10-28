const popupS = require('popups');
import * as React from 'react';
import * as AccountService from '../../../service/account/main';
import DiscordPage from './DiscordPage';
import { DiscordLinkResponse } from '../../../../../client/client-server-common/common';

interface IDiscordPageContainerProps { }

interface IDiscordPageContainerState {
    isLoading: boolean;
    link: string;
}

class DiscordPageContainer extends React.Component<IDiscordPageContainerProps, IDiscordPageContainerState> {

    constructor(props: IDiscordPageContainerProps) {
        super(props);
        this.state = { 
            isLoading: true,
            link: undefined
        };
        this.onClickCopy = this.onClickCopy.bind(this);
        this.loadAccountDiscordLink = this.loadAccountDiscordLink.bind(this);
        this.loadAccountDiscordLink();
    }

    onClickCopy(): void {
        let linkElement: any = document.getElementsByClassName('discord-page-link');
        linkElement[0].select();
        document.execCommand('copy');
        popupS.modal({ content: `Copied invite link!` });
    }

    loadAccountDiscordLink(): void {
        AccountService.httpGetAccountDiscordLink()
            .then( (response: DiscordLinkResponse) => {
                const discordLink: string = response.data ? response.data.link : undefined;
                this.setState({ isLoading: false, link: discordLink });
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
            });
    }

    render() {
        return (
            <DiscordPage
                isLoading={this.state.isLoading}
                link={this.state.link}
                onClickCopy={this.onClickCopy}
            />
        );
    }

}

export default DiscordPageContainer;