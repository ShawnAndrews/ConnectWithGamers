import * as React from 'react';
import { ListItem, Avatar, ListItemText } from '@material-ui/core';
import { getFormattedDate } from '../../../util/main';
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
        const prefixes: string[] = ["http", "www."];
        const suffix: string = " ";
        const getNextLinkIndex = (textStr: string): number => {
            let foundIndex = Math.max(textStr.indexOf(prefixes[0]), textStr.indexOf(prefixes[1]));
            if (textStr.indexOf(prefixes[0]) < foundIndex && textStr.indexOf(prefixes[0]) != -1) {
                foundIndex = textStr.indexOf(prefixes[0]);
            }
            if (textStr.indexOf(prefixes[1]) < foundIndex && textStr.indexOf(prefixes[1]) != -1) {
                foundIndex = textStr.indexOf(prefixes[1]);
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
            if (link.startsWith('https://i.imgur.com')) {
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
        const formattedDate = getFormattedDate(new Date(this.props.chat.date));
        const formattedTime = new Date(this.props.chat.date).toLocaleTimeString();
        const formattedDateTime: string = `${formattedDate} ${formattedTime}`;
                                
        return (
            <ListItem className="message px-5" button={true}>
                {this.props.chat.image
                    ? <Avatar src={this.props.chat.image}/>
                    : <Avatar className="avatar color-primary">{this.props.chat.name.slice(0, 2).toUpperCase()}</Avatar>}
                <ListItemText>
                    <div><span className="name font-weight-bold">{`${this.props.chat.name}   `}</span><span className="time">{`${formattedDateTime}`}</span></div>
                    <p className="text">{this.decodeEmotesAndLinks(this.props.chat.text)}</p>
                    {this.props.chat.attachment && 
                        <img className="attachment mt-1" src={this.props.chat.attachment}/>}
                </ListItemText>
            </ListItem> 
        );
    }

}

export default Message;