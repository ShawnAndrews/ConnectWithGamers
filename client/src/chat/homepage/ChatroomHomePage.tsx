import * as React from 'react';

interface IChatroomHomePageProps {
    chatroomHomePageContainerRef: React.RefObject<HTMLDivElement>;
}

const ChatroomHomePage: React.SFC<IChatroomHomePageProps> = (props: IChatroomHomePageProps) => {

    return (
        <div className="scrollable chatroom-homepage" ref={props.chatroomHomePageContainerRef}>
            <img src="https://i.imgur.com/REkKhkI.jpg" alt="Chatroom Infographic" />
        </div>
    );

};

export default ChatroomHomePage;