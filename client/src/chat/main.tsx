import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ChatroomContainer from '../chat/room/ChatroomContainer';
import UserListContainer from '../chat/userlist/UserlistContainer';
import NotFoundPageContainer from '../notfound/NotFoundPageContainer';

const ChatroomMenu: React.SFC<any> = () => {
    
    return (
        <Switch>
            <Route path="/chat/users" component={UserListContainer}/>
            <Route path="/chat" component={ChatroomContainer}/>
            <Route component={NotFoundPageContainer}/>
        </Switch>
    );

};

export default ChatroomMenu;