import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ChatroomContainer from '../chat/room/ChatroomContainer';
import UserListContainer from '../chat/userlist/UserlistContainer';
import TopnavContainer from './topnav/TopnavContainer';
import SidenavContainer from './sidenav/SidenavContainer';
import Swipeable = require('react-swipeable');
import ChatroomHomePageContainer from './homepage/ChatroomHomePageContainer';
import { CHATROOMS, ChatroomInfo } from '../../client-server-common/common';

interface IChatroomMenuProps {
    onSwipingLeft: (event: React.TouchEvent, delta: number) => void;
    onSwipingRight: (event: React.TouchEvent, delta: number) => void;
    onSwipedLeft: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
    onSwipedRight: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
    movedXPos: number;
    expanded: boolean;
    sidebarWidth: number;
}

const ChatroomMenu: React.SFC<IChatroomMenuProps> = (props: IChatroomMenuProps) => {
    
    return (
        <div className="chatroom">
            <TopnavContainer/>
            <SidenavContainer
                sidebarWidth={props.sidebarWidth}
                movedXPos={props.movedXPos}
            />
            <Swipeable
                onSwipingLeft={props.onSwipingLeft}
                onSwipingRight={props.onSwipingRight}
                onSwipedLeft={props.onSwipedLeft}
                onSwipedRight={props.onSwipedRight}
                delta={0.0000000001}
                stopPropagation={true}
                trackMouse={true}
            >
                <Switch>
                    {CHATROOMS && 
                        CHATROOMS.map((chatroomInfo: ChatroomInfo, index: number) => {
                            return (
                                <Route 
                                    key={chatroomInfo.redirect} 
                                    path={chatroomInfo.redirect}
                                    render={() => <ChatroomContainer chatroomid={index} sidebarWidth={props.sidebarWidth} movedXPos={props.movedXPos} expanded={props.expanded}/>}
                                />
                            );
                        })}
                    <Route path="/chat/users" render={() => <UserListContainer sidebarWidth={props.sidebarWidth} movedXPos={props.movedXPos} expanded={props.expanded}/>}/>
                    <Route path="/chat" render={() => <ChatroomHomePageContainer sidebarWidth={props.sidebarWidth} movedXPos={props.movedXPos} expanded={props.expanded}/>}/>
                </Switch>
            </Swipeable>
        </div>
    );

};

export default ChatroomMenu;