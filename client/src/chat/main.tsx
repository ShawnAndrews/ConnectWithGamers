import * as React from 'react';
import TopnavContainer from './topnav/TopnavContainer';
import LeftnavContainer from './leftnav/LeftnavContainer';
import RightnavContainer from './rightnav/RightnavContainer';
import MiddlenavContainer from './middlenav/MiddlenavContainer';

interface IChatroomMenuProps {
    expanded: boolean;
    toggleExpanded: () => void;
}

const ChatroomMenu: React.SFC<IChatroomMenuProps> = (props: IChatroomMenuProps) => {
    
    return (
        <div className="chatroom w-100">
            <TopnavContainer
                expanded={props.expanded}
                toggleExpanded={props.toggleExpanded}
            />
            <div className="content mx-0">
                <LeftnavContainer/>
                <MiddlenavContainer
                    expanded={props.expanded}
                />
                <RightnavContainer
                    expanded={props.expanded}
                />
            </div>
        </div>
    );

};

export default ChatroomMenu;