import { combineReducers } from 'redux';
import chatroom from './chatroom/main';
import { SwipeState } from '../chat/ChatroomMenuContainer';
​
export interface ChatroomReduxState {
    swipeState: SwipeState;
    leftNavWidth: number;
    rightNavWidth: number;
}

export default combineReducers({
    chatroom
});