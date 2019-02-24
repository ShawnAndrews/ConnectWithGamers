import * as React from 'react';
import Spinner from '../../spinner/main';
import { SingleChatHistory } from '../../../../client/client-server-common/common';
import { List, ListSubheader } from '@material-ui/core';
import MessageBoxContainer from './messagebox/MessageBoxContainer';
import Message from './message/Message';

interface IChatroomProps {
    messagesLoading: boolean;
    chatLog: Array<SingleChatHistory>;
    onSendCallback: (text: string, attachmentBase64: string, attachmentFileExtension: string) => void;
}

const Chatroom: React.SFC<IChatroomProps> = (props: IChatroomProps) => {
    let todayHeaderRendered: boolean = false;
    let yesterdayHeaderRendered: boolean = false;
    let EarlierThisWeekHeaderRendered: boolean = false;
    let EarlierThisMonthHeaderRendered: boolean = false;

    const renderSubheader = (date: Date): React.ReactNode => {
        const today: Date = new Date();
        const yesterday: Date = new Date(new Date().setDate(today.getDate() - 1));
        const firstDayOfThisWeek: Date = new Date(new Date().setDate(today.getDate() - today.getDay()));
        const firstDayOfThisMonth: Date = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const postedToday: boolean = (today.toDateString() === date.toDateString());
        const postedYesterday: boolean = (yesterday.toDateString() === date.toDateString());
        const postedThisWeek: boolean = (date >= firstDayOfThisWeek && date < new Date(today.getTime()));
        const postedThisMonth: boolean = (date >= firstDayOfThisMonth && date < new Date(today.getTime()));

        if (postedToday && !todayHeaderRendered) {
            todayHeaderRendered = true;
            return <ListSubheader disableSticky={true}>Today</ListSubheader>;
        } else if (postedYesterday && !postedToday && !yesterdayHeaderRendered) {
            yesterdayHeaderRendered = true;
            return <ListSubheader disableSticky={true}>Yesterday</ListSubheader>;
        } else if (postedThisWeek && !postedYesterday && !postedToday && !EarlierThisWeekHeaderRendered) {
            EarlierThisWeekHeaderRendered = true;
            return <ListSubheader disableSticky={true}>Earlier this week</ListSubheader>;
        } else if (postedThisMonth && !postedThisWeek && !postedYesterday && !postedToday && !EarlierThisMonthHeaderRendered) {
            EarlierThisMonthHeaderRendered = true;
            return <ListSubheader disableSticky={true}>Earlier this month</ListSubheader>;
        } else {
            return undefined;
        }
    };

    return (
        <>
            <div className="chatroom-messages py-3 pr-2">
                <div className={`chatroom-messages-container y-scrollable custom-scrollbar h-100`}>
                    {props.messagesLoading && 
                        <div className="chatroom-messages-loading">
                            <Spinner className="text-center mt-5 pt-5" loadingMsg="Loading chat..." />
                        </div>}
                    {!props.messagesLoading && props.chatLog.length === 0 && 
                        <h3 className="text-center mt-5 color-tertiary">No comments<i className="far fa-comments ml-3"/></h3>}
                    {!props.messagesLoading &&
                        <List className="pr-2">
                            {props.chatLog
                                .map((x: SingleChatHistory, index: number) => (
                                    <React.Fragment key={index}>
                                        {renderSubheader(x.date)}
                                        <Message
                                            chat={x}
                                        />
                                    </React.Fragment>
                                ))}
                        </List>}
                </div>
            </div>
            <MessageBoxContainer
                onSendCallback={props.onSendCallback}
            />
        </>
    );

};

export default Chatroom;