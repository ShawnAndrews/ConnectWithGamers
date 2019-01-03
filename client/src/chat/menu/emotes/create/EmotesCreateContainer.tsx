const popupS = require('popups');
import * as React from 'react';
import EmotesCreate from "./EmotesCreate";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as AccountService from '../../../../service/account/main';
import * as ChatroomService from '../../../../service/chatroom/main';
import { ChatroomEmotesResponse, AUTH_TOKEN_NAME, AccountInfoResponse } from '../../../../../client-server-common/common';

interface IEmotesCreateContainerProps extends RouteComponentProps<any> { }

interface IEmotesCreateContainerState {
    uploadedImage: string;
    isLoading: boolean;
    isLoadingCreate: boolean;
    attachmentLoading: boolean;
    emotePrefix: string;
    emoteSuffix: string;
    emoteCompletionScreen: boolean;
}

class EmotesCreateContainer extends React.Component<IEmotesCreateContainerProps, IEmotesCreateContainerState> {

    constructor(props: IEmotesCreateContainerProps) {
        super(props);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleEmoteNameChange = this.handleEmoteNameChange.bind(this);
        this.loadUsername = this.loadUsername.bind(this);
        this.onClickCreateEmote = this.onClickCreateEmote.bind(this);
        this.onClickCreateBack = this.onClickCreateBack.bind(this);
        this.onClickCreateGoToEmotes = this.onClickCreateGoToEmotes.bind(this);
        
        this.state = { 
            uploadedImage: undefined, 
            isLoading: true, 
            isLoadingCreate: undefined,
            attachmentLoading: undefined,
            emotePrefix: "anon", 
            emoteSuffix: "",
            emoteCompletionScreen: undefined
        };
    }

    componentDidMount(): void {
        const settingsPromises: Promise<void>[] = [];
        const loggedIn: boolean = (document.cookie.indexOf(`${AUTH_TOKEN_NAME}=`) !== -1);

        if (loggedIn) {
            settingsPromises.push(this.loadUsername());
        }

        Promise.all(settingsPromises)
        .then(() => {
            this.setState({ isLoading: false });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• Error loading chatroom emotes: ${error}</div>` });
        });
    }

    loadUsername(): Promise <void> {
        return new Promise( (resolve, reject) => {
            AccountService.httpAccountSettings()
            .then( (response: AccountInfoResponse) => {
                const username = response.data.username;
                const email = response.data.email;
                this.setState({ emotePrefix: username });
                return resolve();
            })
            .catch( (error: string) => {
                popupS.modal({ content: `<div>• ${error}</div>` });
                return reject(error);
            });
        });
    }

    handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const getBase64 = (file: File) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        getBase64(event.target.files[0])
        .then((imageBase64: string) => {
            this.setState({ uploadedImage: imageBase64 });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>Error converting image to base 64. ${error}</div>` });
        });
    }

    handleEmoteNameChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        this.setState({ emoteSuffix: event.target.value });
    }

    onClickCreateEmote(): void {

        if (this.state.emoteSuffix.length !== 0 && this.state.uploadedImage ) {
            this.setState({ isLoadingCreate: true }, () => {
                ChatroomService.httpUploadEmote(this.state.uploadedImage, this.state.emotePrefix, this.state.emoteSuffix)
                .then( (response: ChatroomEmotesResponse) => {
                    this.setState({ emoteSuffix: "", uploadedImage: undefined, isLoadingCreate: false, emoteCompletionScreen: true });
                })
                .catch( (error: string) => {
                    this.setState({ attachmentLoading: false, isLoadingCreate: false });
                    popupS.modal({ content: `<div>• ${error}</div>` });
                });
            });
        }

    }

    onClickCreateBack(): void {
        this.setState({ emoteCompletionScreen: undefined });
    }

    onClickCreateGoToEmotes(): void {
        this.props.history.push('/chat/emotes');
    }

    render() {
        
        return (
            <EmotesCreate
                isLoading={this.state.isLoading}
                isLoadingCreate={this.state.isLoadingCreate}
                emotePrefix={this.state.emotePrefix}
                uploadedImage={this.state.uploadedImage}
                emoteSuffix={this.state.emoteSuffix}
                emoteCompletionScreen={this.state.emoteCompletionScreen}
                handleImageChange={this.handleImageChange}
                handleEmoteNameChange={this.handleEmoteNameChange}
                onClickCreateEmote={this.onClickCreateEmote}
                onClickCreateBack={this.onClickCreateBack}
                onClickCreateGoToEmotes={this.onClickCreateGoToEmotes}
            />
        );
    }

}

export default withRouter(EmotesCreateContainer);