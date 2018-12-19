import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ChatroomContainer from '../room/ChatroomContainer';
import UserListContainer from '../userlist/UserlistContainer';
import EmotesViewContainer from '../menu/emotes/view/EmotesViewContainer';
import EmotesCreateContainer from '../menu/emotes/create/EmotesCreateContainer';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';
import { Paper } from '@material-ui/core';

interface IMiddlenavProps { }

const Middlenav: React.SFC<IMiddlenavProps> = (props: IMiddlenavProps) => {

    return (
        <Paper className="col-9 br-0">
            <Switch>
                <Route path="/chat/emotes/create" render={() => <EmotesCreateContainer/>}/>
                <Route path="/chat/emotes" render={() => <EmotesViewContainer/>}/>
                <Route path="/chat/users/:user" render={() => <UserListContainer/>}/>
                <Route path="/chat/users" render={() => <UserListContainer/>}/>
                {CHATROOMS && 
                    CHATROOMS
                        .map((chatroomInfo: ChatroomInfo, index: number) => {
                            return (
                                <Route 
                                    key={chatroomInfo.redirect} 
                                    path={chatroomInfo.redirect}
                                    render={() => <ChatroomContainer chatroomid={index}/>}
                                    exact={true}
                                />
                            );
                    })}
            </Switch>
        </Paper>
    );

};

export default Middlenav;