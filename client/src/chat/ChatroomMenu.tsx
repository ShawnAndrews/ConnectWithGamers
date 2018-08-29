import * as React from 'react';
import TopnavContainer from './topnav/TopnavContainer';
import SidenavContainer from './sidenav/SidenavContainer';
import UsersnavContainer from './usersnav/UsersnavContainer';
import Swipeable = require('react-swipeable');
import { SwipeState } from './ChatroomMenuContainer';
import SwipeContainer from './swipe/SwipeContainer';

interface IChatroomMenuProps {
    onSwipedLeft: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
    onSwipedRight: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
    swipeState: SwipeState;
    sidebarWidth: number;
    usersbarWidth: number;
}

const ChatroomMenu: React.SFC<IChatroomMenuProps> = (props: IChatroomMenuProps) => {
    
    return (
        <div className="chatroom">
            <TopnavContainer/>
            <Swipeable
                onSwipedLeft={props.onSwipedLeft}
                onSwipedRight={props.onSwipedRight}
                delta={0.0000000001}
                stopPropagation={true}
                trackMouse={true}
            >
                <SidenavContainer
                    sidebarWidth={props.sidebarWidth}
                    swipeState={props.swipeState}
                />
                <UsersnavContainer
                    usersbarWidth={props.usersbarWidth}
                    swipeState={props.swipeState}
                />
                <SwipeContainer 
                    sidebarWidth={props.sidebarWidth}
                    usersnavWidth={props.usersbarWidth}
                    swipeState={props.swipeState}
                />
            </Swipeable>
        </div>
    );

};

export default ChatroomMenu;