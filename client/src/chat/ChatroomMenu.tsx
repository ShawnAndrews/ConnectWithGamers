import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ChatroomContainer from '../chat/room/ChatroomContainer';
import UserListContainer from '../chat/userlist/UserlistContainer';
import NotFoundPageContainer from '../notfound/NotFoundPageContainer';
import TopnavContainer from './topnav/TopnavContainer';
import SidenavContainer from './sidenav/SidenavContainer';

interface IChatroomMenuProps {
    sidebarActive: boolean;
    toggleSidebar: () => void;
}

const ChatroomMenu: React.SFC<IChatroomMenuProps> = (props: IChatroomMenuProps) => {
    
    return (
        <div className="chatroom">
            <TopnavContainer
                toggleSidebar={props.toggleSidebar}
            />
            <SidenavContainer
                active={props.sidebarActive}
                toggleSidebar={props.toggleSidebar}
            />
            <Switch>
                <Route path="/chat/users" render={() => <UserListContainer sidebarActive={props.sidebarActive}/>}/>
                <Route path="/chat" render={() => <ChatroomContainer sidebarActive={props.sidebarActive}/>}/>
            </Switch>
        </div>
    );

};

export default ChatroomMenu;