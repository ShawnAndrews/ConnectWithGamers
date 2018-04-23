import * as React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Spinner from '../../spinner/main';
import ChatMessageContainer, { IChatMessageContainerProps } from '../message/ChatMessageContainer';

export enum MessageSide {
    Left,
    Right
}

interface IChatroomProps {
    userCount: number;
    attachmentLink: string;
    attachmentLoading: boolean;
    messagesLoading: boolean;
    userCountLoading: boolean;
    text: string;
    chatLog: IChatMessageContainerProps[];
    sidebarActive: boolean;
    onTextChanged: (event: object, newText: string) => void;
    onNewUsercount: (userCount: number) => void;
    onKeyPress: (event: any) => void;
    onSend: (event: any) => void;
    handleAttachmentUpload: (event: any) => void;
}

const Chatroom: React.SFC<IChatroomProps> = (props: IChatroomProps) => {

    let lastSide: MessageSide = MessageSide.Left;
    let lastName: string = null;

    return (
        <div>
            <div className={`scrollable chatroom-messages ${props.sidebarActive ? "active" : ""}`} >
                {props.messagesLoading && 
                    <div className="chatroom-messages-loading">
                        <Spinner loadingMsg="Loading chat..." />
                    </div>}
                {!props.messagesLoading &&
                    props.chatLog.map((x: IChatMessageContainerProps, index: number) => {
                        let side: MessageSide = lastSide;
                        let repeat: boolean = false;

                        if (lastName === x.name) {
                            repeat = true;
                        } else {
                            // flip message side
                            if (side === MessageSide.Left) {
                                side = MessageSide.Right;
                            } else {
                                side = MessageSide.Left;
                            }
                        }

                        lastName = x.name;
                        lastSide = side;

                        return (
                            <ChatMessageContainer
                                key={index}
                                name={x.name}
                                date={x.date}
                                text={x.text}
                                image={x.image}
                                attachment={x.attachment}
                                side={side}
                                repeat={repeat}
                            />
                        );
                    })}
            </div>
            <div className="chatroom-input" >
                <label className="chatroom-input-icon-container" htmlFor="fileInput">
                    {!props.attachmentLoading
                        ? <i className="fas fa-paperclip fa-lg"/>
                        : <i className="fas fa-spinner fa-spin fa-lg"/>}
                    {!props.attachmentLoading && 
                        <input className="chatroom-input-icon-input" type="file" id="fileInput" onChange={(e) => props.handleAttachmentUpload(e)}/>}
                </label>
                <TextField
                    className="chatroom-input-textfield"
                    value={props.text}
                    onChange={props.onTextChanged}
                    hintText="Write a message..."
                    onKeyPress={props.onKeyPress}
                />
                <RaisedButton className="chatroom-input-send" label="Send" primary={true} onClick={props.onSend} disabled={props.attachmentLoading} />
            </div>;
        </div>
    );

};

export default Chatroom;