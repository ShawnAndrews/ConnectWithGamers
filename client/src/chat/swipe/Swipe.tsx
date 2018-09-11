import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ChatroomContainer from '../../chat/room/ChatroomContainer';
import UserListContainer from '../../chat/userlist/UserlistContainer';
import SettingsContainer from '../../chat/settings/SettingsContainer';
import ChatroomHomePage from './../homepage/ChatroomHomePage';
import { CHATROOMS, ChatroomInfo } from '../../../client-server-common/common';

interface ISwipeProps {
    swipeContainerRef: React.RefObject<HTMLDivElement>;
}

const Swipe: React.SFC<ISwipeProps> = (props: ISwipeProps) => {

    return (
        <div className={`swipe-container`} ref={props.swipeContainerRef}>
            <Switch>
                {CHATROOMS && 
                    CHATROOMS.map((chatroomInfo: ChatroomInfo, index: number) => {
                        return (
                            <Route 
                                key={chatroomInfo.redirect} 
                                path={chatroomInfo.redirect}
                                render={() => <ChatroomContainer chatroomid={index}/>}
                            />
                        );
                    })}
                <Route path="/chat/settings" render={() => <SettingsContainer/>}/>
                <Route path="/chat/users/:user" render={() => <UserListContainer/>}/>
                <Route path="/chat/users" render={() => <UserListContainer/>}/>
                <Route path="/chat" render={() => <ChatroomHomePage/>}/>
            </Switch>
        </div>
    );

};

export default Swipe;