import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface IMessageBoxProps {
    attachmentLoading: boolean;
    text: string;
    onTextChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<Element>) => void;
    handleAttachmentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageBox: React.SFC<IMessageBoxProps> = (props: IMessageBoxProps) => {

    return (
        <div className="chatroom-messagebox p-1">
            <label className="attachment-icon position-relative cursor-pointer h-100" htmlFor="fileInput">
                {!props.attachmentLoading
                    ? <i className="fas fa-paperclip fa-lg text-center"/>
                    : <i className="fas fa-spinner fa-spin fa-lg text-center"/>}
                {!props.attachmentLoading && 
                    <input className="d-none" type="file" id="fileInput" onChange={props.handleAttachmentUpload}/>}
            </label>
            <TextField
                className="messagefield mt-1 pr-2"
                onChange={props.onTextChanged}
                placeholder="Write a message..."
                onKeyPress={props.onKeyPress}
                value={props.text}
                margin="normal"
            />
        </div>
    );

};

export default MessageBox;