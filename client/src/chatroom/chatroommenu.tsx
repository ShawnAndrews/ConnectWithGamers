import * as React from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Chatroom from '../chatroom/chatroom';
import UserList from '../chatroom/userlist';
import NotFound from '../notfound/notfound';

interface IChatroomMenuProps {
    history: any;
}

class ChatroomMenu extends React.Component<IChatroomMenuProps, any> {

    constructor(props: IChatroomMenuProps) {
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

export default withRouter(ChatroomMenu);