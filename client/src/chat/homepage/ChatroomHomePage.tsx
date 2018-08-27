import * as React from 'react';

interface IChatroomHomePageProps {
    chatroomHomePageContainerRef: React.RefObject<HTMLDivElement>;
}

const ChatroomHomePage: React.SFC<IChatroomHomePageProps> = (props: IChatroomHomePageProps) => {

    return (
        <div className="scrollable chatroom-homepage" ref={props.chatroomHomePageContainerRef}>
            <div className="chatroom-homepage-infographic">
                <img className="chatroom-homepage-main" src="https://i.imgur.com/3C3lZmv.jpg" alt="Chatroom Infographic" width="100%"/>
                <img className="chatroom-homepage-pikachu" src="https://i.imgur.com/ob3k0x6.gif" alt="Pikachu gif"/>
                <img className="chatroom-homepage-yoshi" src="https://i.imgur.com/qtyzNwC.gif" alt="Yoshi gif"/>
                <img className="chatroom-homepage-meme" src="https://i.imgur.com/s6klXLE.jpg" alt="Meme"/>
            </div>
        </div>
    );

};

export default ChatroomHomePage;