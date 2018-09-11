import * as React from 'react';
import TopnavContainer from './topnav/TopnavContainer';
import LeftnavContainer from './leftnav/LeftnavContainer';
import RightnavContainer from './rightnav/RightnavContainer';
import Swipeable = require('react-swipeable');
import SwipeContainer from './swipe/SwipeContainer';

interface IChatroomMenuProps {
    onSwipedLeft: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
    onSwipedRight: (event: React.TouchEvent, delta: number, isFlick: boolean) => void;
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
                <LeftnavContainer/>
                <RightnavContainer/>
                <SwipeContainer/>
            </Swipeable>
        </div>
    );

};

export default ChatroomMenu;