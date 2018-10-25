import * as React from 'react';

interface IChatroomHomePageProps {

}

const ChatroomHomePage: React.SFC<IChatroomHomePageProps> = (props: IChatroomHomePageProps) => {

    return (
        <div className="scrollable chatroom-homepage">
            <div className="chatroom-homepage-infographic">
                <img className="chatroom-homepage-main" src="https://i.imgur.com/oxCDt6Z.png" alt="Chatroom Infographic" width="100%"/>
                <img className="chatroom-homepage-pikachu" src="https://i.imgur.com/ob3k0x6.gif" alt="Pikachu gif"/>
                <img className="chatroom-homepage-yoshi" src="https://i.imgur.com/qtyzNwC.gif" alt="Yoshi gif"/>
                <img className="chatroom-homepage-meme" src="https://i.imgur.com/s6klXLE.jpg" alt="Meme"/>
                <img className="chatroom-homepage-coin1" src="https://i.imgur.com/cR2YGvg.gif" alt="Coin"/>
                <img className="chatroom-homepage-coin2" src="https://i.imgur.com/cR2YGvg.gif" alt="Coin"/>
                <img className="chatroom-homepage-coin3" src="https://i.imgur.com/cR2YGvg.gif" alt="Coin"/>
                <img className="chatroom-homepage-coin4" src="https://i.imgur.com/cR2YGvg.gif" alt="Coin"/>
                <img className="chatroom-homepage-coin5" src="https://i.imgur.com/cR2YGvg.gif" alt="Coin"/>
                <img className="chatroom-homepage-coin5" src="https://i.imgur.com/cR2YGvg.gif" alt="Coin"/>
                <img className="chatroom-homepage-mario" src="https://i.imgur.com/EBBRMTq.gif" alt="Mario"/>
            </div>
        </div>
    );

};

export default ChatroomHomePage;