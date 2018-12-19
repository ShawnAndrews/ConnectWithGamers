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

    decodeEmotes = (text: string): React.ReactNode[] => {
        const result: React.ReactNode[] = [];
        const prefix: string = ":::";
        const suffix: string = ":::";
        let foundPrefix: number = text.indexOf(prefix);
        while (foundPrefix !== -1) {
            const spanText: string = text.substring(0, foundPrefix);
            result.push(<span>{spanText}</span>);

            text = text.substring(foundPrefix + prefix.length);
            const foundSuffix: number = text.indexOf(suffix);
            const emoteLink: string = text.substring(0, foundSuffix);
            result.push(<img src={emoteLink} width="28" height="28" />);

            text = text.substring(foundSuffix + suffix.length);
            foundPrefix = text.indexOf(prefix);
        }
        result.push(<span>{text}</span>);
        return result;
    }

    render() {
        const formattedDate = getFormattedDate(new Date(this.props.chat.date));
        const formattedTime = new Date(this.props.chat.date).toLocaleTimeString();
        const formattedDateTime: string = `${formattedDate} ${formattedTime}`;
                                
        return (
            <ListItem className="message" button={true}>
                {this.props.chat.image
                    ? <Avatar src={this.props.chat.image}/>
                    : <Avatar className="bg-primary">{this.props.chat.name.slice(0, 2).toUpperCase()}</Avatar>}
                <ListItemText>
                    <div><span className="name color-primary font-weight-bold">{`${this.props.chat.name}   `}</span><span className="time">{`${formattedDateTime}`}</span></div>
                    <p className="text">{this.decodeEmotes(this.props.chat.text)}</p>
                    {this.props.chat.attachment && 
                        <img className="w-25" src={this.props.chat.attachment}/>}
                </ListItemText>
            </ListItem> 
        );
    }

}

export default Message;