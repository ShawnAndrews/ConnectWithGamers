const popupS = require('popups');
import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Spinner from '../../spinner/main';
import ChatMessageContainer, { IChatMessageContainerProps } from '../message/ChatMessageContainer';

export enum MessageSide {
    Left,
    Right
}

interface IChatroomProps {
    attachmentLink: string;
    attachmentLoading: boolean;
    messagesLoading: boolean;
    text: string;
    chatLog: IChatMessageContainerProps[];
    onTextChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: any) => void;
    onSend: (event: any) => void;
    handleAttachmentUpload: (event: any) => void;
    chatroomContainerRef: React.RefObject<HTMLDivElement>;
}

const Chatroom: React.SFC<IChatroomProps> = (props: IChatroomProps) => {

    let lastSide: MessageSide = MessageSide.Left;
    let lastName: string = null;
    let isLastMessageDifferentPerson: boolean = false;

    return (
        <>
            <div className={`scrollable chatroom-messages`} ref={props.chatroomContainerRef}>
                {props.messagesLoading && 
                    <div className="chatroom-messages-loading">
                        <Spinner loadingMsg="Loading chat..." />
                    </div>}
                {!props.messagesLoading &&
                    props.chatLog.map((x: IChatMessageContainerProps, index: number) => {
                        const currentName: string = x.name;
                        const isLastMessageDifferentPerson: boolean = (lastName !== currentName);
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
                            <>
                                {index !== 0 && isLastMessageDifferentPerson 
                                    && <div className="divider"/>}
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
                            </>
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
                    onChange={props.onTextChanged}
                    placeholder="Write a message..."
                    onKeyPress={props.onKeyPress}
                    margin="normal"
                />
                <Button
                    className="chatroom-input-send" 
                    variant="contained" 
                    color="primary" 
                    onClick={props.onSend} 
                    disabled={props.attachmentLoading} 
                >
                    Send 
                </Button>
            </div>
        </>
    );

};

export default Chatroom;