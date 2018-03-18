import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Chatroom from '../chatroom/chatroom';
import UserList from '../chatroom/userlist';
import NotFound from '../notfound/notfound';

class ChatroomMenu extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {

        // render
        return (
            <Switch>
                <Route path="/chat/users" component={UserList}/>
                <Route path="/chat" component={Chatroom}/>
                <Route component={NotFound}/>
            </Switch>
        );

    }

}

export default ChatroomMenu;