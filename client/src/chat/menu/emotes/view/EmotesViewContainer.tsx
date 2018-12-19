const popupS = require('popups');
import * as React from 'react';
import EmotesView from "./EmotesView";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as ChatroomService from '../../../../service/chatroom/main';
import { ChatroomEmotesResponse, ChatroomEmote, AUTH_TOKEN_NAME } from '../../../../../client-server-common/common';

interface IEmotesViewContainerProps extends RouteComponentProps<any> { }

interface IEmotesViewContainerState {
    isLoading: boolean;
    emotes: ChatroomEmote[];
}

class EmotesViewContainer extends React.Component<IEmotesViewContainerProps, IEmotesViewContainerState> {

    constructor(props: IEmotesViewContainerProps) {
        super(props);

        this.state = { 
            isLoading: true, 
            emotes: undefined
        };
    }

    componentDidMount(): void {
        const settingsPromises: Promise<void>[] = [];
        const loggedIn: boolean = (document.cookie.indexOf(`${AUTH_TOKEN_NAME}=`) !== -1);

        settingsPromises.push(this.loadEmotes());

        Promise.all(settingsPromises)
        .then(() => {
            this.setState({ isLoading: false });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• Error loading chatroom emotes: ${error}</div>` });
        });
    }

    loadEmotes(): Promise <void> {
        return new Promise( (resolve, reject) => {
            ChatroomService.httpGetEmotes()
            .then( (response: ChatroomEmotesResponse) => {
                this.setState({ emotes: response.emotes });
                return resolve();
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                return reject(error);
            });
        });
    }

    render() {
        
        return (
            <EmotesView
                isLoading={this.state.isLoading}
                emotes={this.state.emotes}
            />
        );
    }

}

export default withRouter(EmotesViewContainer);