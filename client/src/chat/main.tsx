import * as React from 'react';
import TopnavContainer from './topnav/TopnavContainer';
import LeftnavContainer from './leftnav/LeftnavContainer';
import RightnavContainer from './rightnav/RightnavContainer';
import MiddlenavContainer from './middlenav/MiddlenavContainer';

interface IChatroomMenuProps {
    
}

const ChatroomMenu: React.SFC<IChatroomMenuProps> = (props: IChatroomMenuProps) => {
    
    return (
        <div className="container chatroom mt-4">
            <TopnavContainer/>
            <div className="content row mx-0">
                <LeftnavContainer/>
                <MiddlenavContainer/>
                <RightnavContainer/>
            </div>
        </div>
    );

};

export default ChatroomMenu;