import * as React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import People from 'material-ui/svg-icons/social/people';
import Spinner from '../../spinner/main';
import ChatMessageContainer, { IChatMessageContainerProps } from '../message/ChatMessageContainer';

interface IChatroomProps {
    userCount: number;
    messagesLoading: boolean;
    userCountLoading: boolean;
    text: string;
    chatLog: IChatMessageContainerProps[];
    onTextChanged: (event: object, newText: string) => void;
    onNewUsercount: (userCount: number) => void;
    goToUsers: () => void;
    onSend: (event: any) => void;
}

const Chatroom: React.SFC<IChatroomProps> = (props: IChatroomProps) => {

    return (
        <div className="chatroom">
            <AppBar
                className="chatroom-appbar"
                title="Chatroom"
                iconElementLeft={
                    <IconMenu
                        className="appbar-menu"
                        {...props}
                        iconButtonElement={
                            <IconButton><MoreVertIcon/></IconButton>
                        }
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    >
                    <MenuItem className="appbar-menu-item" primaryText="User List" onClick={props.goToUsers} />
                    <Divider />
                    <MenuItem className="appbar-menu-item" primaryText={props.userCountLoading ? "Loading users..." : `${props.userCount} users online`} leftIcon={<People/>} />
                    </IconMenu>
                }
            />
            <div className="scrollable chatroom-messages" >
                {props.messagesLoading && 
                    <div className="chatroom-messages-loading">
                        <Spinner loadingMsg="Loading chat..." />
                    </div>}
                {!props.messagesLoading &&
                    props.chatLog.map((x: IChatMessageContainerProps, index: number) => {
                        return (
                            <ChatMessageContainer
                                key={index}
                                name={x.name}
                                date={x.date}
                                text={x.text}
                                image={x.image}
                            />
                        );
                    })}
            </div>
            <div className="chatroom-input" >
                <TextField
                    className="chatroom-input-textfield"
                    value={props.text}
                    onChange={props.onTextChanged}
                    hintText="Enter a message"
                    onKeyPress={props.onSend}
                />
            </div>
        </div>
    );

};

export default Chatroom;