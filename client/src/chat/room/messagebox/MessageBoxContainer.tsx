const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MessageBox from './MessageBox';
import * as ChatroomService from '../../../service/chatroom/main';
import { ChatroomUploadImageResponse } from '../../../../../client/client-server-common/common';

interface IMessageBoxContainerProps extends RouteComponentProps<any> {
    onSendCallback: (text: string, attachmentBase64: string, attachmentFileExtension: string) => void;
}

interface IMessageBoxContainerState {
    attachmentLoading: boolean;
    attachmentBase64: string;
    attachmentFileExtension: string;
    text: string;
}

class MessageBoxContainer extends React.Component<IMessageBoxContainerProps, IMessageBoxContainerState> {

    constructor(props: IMessageBoxContainerProps) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSend = this.onSend.bind(this);
        this.handleAttachmentUpload = this.handleAttachmentUpload.bind(this);

        this.state = { 
            attachmentLoading: false, 
            attachmentBase64: undefined,
            attachmentFileExtension: undefined,
            text: ''
        };
    }

    onTextChanged(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ text: event.currentTarget.value });
    } 

    onKeyPress(event: React.KeyboardEvent<Element>): void {
        if (event.key === `Enter` && !this.state.attachmentLoading) {
            this.onSend();
        }
    }

    onSend(): void {
        if (this.state.text !== "" || this.state.attachmentBase64) {
            this.props.onSendCallback(this.state.text, this.state.attachmentBase64, this.state.attachmentFileExtension);
            this.setState({ text: "", attachmentBase64: undefined, attachmentFileExtension: undefined });
        }
    }

    handleAttachmentUpload(event: React.ChangeEvent<HTMLInputElement>): void {

        const getBase64 = (file: File) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        let fileExtension: string = undefined;

        try {
            fileExtension = event.target.files[0].name.split(".")[1];
        } catch (err) { }

        getBase64(event.target.files[0])
        .then((imageBase64: string) => {
            this.setState({ attachmentLoading: true }, () => {
                this.setState({ attachmentLoading: false, attachmentBase64: imageBase64, attachmentFileExtension: fileExtension});
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>Error converting image to base 64. ${error}</div>` });
        });

    }

    render() {
        return (
            <MessageBox
                attachmentLoading={this.state.attachmentLoading}
                text={this.state.text}
                onTextChanged={this.onTextChanged}
                onKeyPress={this.onKeyPress}
                handleAttachmentUpload={this.handleAttachmentUpload}
            />
        );
    }

}

export default withRouter(MessageBoxContainer);