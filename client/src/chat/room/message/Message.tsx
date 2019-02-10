import * as React from 'react';
import { ListItem, Avatar, ListItemText } from '@material-ui/core';
import { SingleChatHistory } from '../../../../client-server-common/common';

interface IMessageProps {
    chat: SingleChatHistory;
}

class Message extends React.PureComponent<IMessageProps, null> {

    constructor(props: IMessageProps) {
        super(props);
    }

    decodeEmotesAndLinks = (text: string): React.ReactNode[] => {
        const result: React.ReactNode[] = [];
        const prefixes: string[] = ["http", "www.", "/cache"];
        const suffix: string = " ";
        const getNextLinkIndex = (textStr: string): number => {
            let foundIndex = Math.max(textStr.indexOf(prefixes[0]), textStr.indexOf(prefixes[1]), textStr.indexOf(prefixes[2]));
            if (textStr.indexOf(prefixes[0]) < foundIndex && textStr.indexOf(prefixes[0]) != -1) {
                foundIndex = textStr.indexOf(prefixes[0]);
            }
            if (textStr.indexOf(prefixes[1]) < foundIndex && textStr.indexOf(prefixes[1]) != -1) {
                foundIndex = textStr.indexOf(prefixes[1]);
            }
            if (textStr.indexOf(prefixes[2]) < foundIndex && textStr.indexOf(prefixes[2]) != -1) {
                foundIndex = textStr.indexOf(prefixes[2]);
            }
            return foundIndex;
        };

        let nextLinkIndex: number = getNextLinkIndex(text);

        while (nextLinkIndex !== -1) {
            const spanText: string = text.substring(0, nextLinkIndex);
            result.push(<span>{spanText}</span>);

            text = text.substring(nextLinkIndex);
            const foundSuffix: number = text.indexOf(suffix);
            const link: string = foundSuffix !== -1 ? text.substring(0, foundSuffix) : text.substring(0);
            
            if (link.startsWith("/cache")) {
                result.push(<img src={link} width="28" height="28" />);
            } else {
                result.push(<a target="_blank" href={link}>{link}</a>);
            }

            text = text.substring(link.length);
            nextLinkIndex = getNextLinkIndex(text);
        }
        result.push(<span>{text}</span>);
        return result;
    }

    render() {
        const profileLink: string = `/cache/chatroom/profile/NEEDTOPASSACCTIDHERE.${this.props.chat.profileFileExtension}`;
        const hasAttachment: boolean = Boolean(this.props.chat.attachment);
        const attachmentLink: string = `/cache/chatroom/attachment/${this.props.chat.chatroomMessageId}.${this.props.chat.attachmentFileExtension}`;

        return (
            <ListItem className="message px-5" button={true}>
                {this.props.chat.profile
                    ? <Avatar src={profileLink}/>
                    : <Avatar className="avatar color-primary bg-tertiary">{this.props.chat.name.slice(0, 2).toUpperCase()}</Avatar>}
                <ListItemText>
                    <div><span className="name font-weight-bold">{`${this.props.chat.name}   `}</span><span className="time">{new Date(this.props.chat.date).toLocaleTimeString()}</span></div>
                    <p className="text">{this.decodeEmotesAndLinks(this.props.chat.text)}</p>
                    {hasAttachment && 
                        <img className="attachment mt-1" src={attachmentLink}/>}
                </ListItemText>
            </ListItem> 
        );
    }

}

export default Message;