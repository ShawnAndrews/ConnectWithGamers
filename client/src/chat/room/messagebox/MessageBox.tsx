import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface IMessageBoxProps {
    attachmentLoading: boolean;
    text: string;
    onTextChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<Element>) => void;
    onSend: () => void;
    handleAttachmentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageBox: React.SFC<IMessageBoxProps> = (props: IMessageBoxProps) => {

    return (
        <div className="chatroom-messagebox row p-1">
            <label className="attachment-icon col-2 col-sm-1 mb-0 p-0" htmlFor="fileInput">
                {!props.attachmentLoading
                    ? <i className="fas fa-paperclip fa-lg text-center"/>
                    : <i className="fas fa-spinner fa-spin fa-lg text-center"/>}
                {!props.attachmentLoading && 
                    <input className="d-none" type="file" id="fileInput" onChange={props.handleAttachmentUpload}/>}
            </label>
            <TextField
                className="messagefield col-6 col-sm-9 m-0 pr-3"
                onChange={props.onTextChanged}
                placeholder="Write a message..."
                onKeyPress={props.onKeyPress}
                value={props.text}
                margin="normal"
            />
            <Button
                className="chatroom-input-send col-4 col-sm-2" 
                variant="contained" 
                color="primary" 
                onClick={() => { props.onSend(); }} 
            >
                Send
                <i className="fas fa-angle-right ml-1"/>
            </Button>
        </div>
    );

};

export default MessageBox;