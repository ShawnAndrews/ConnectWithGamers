import { combineReducers } from 'redux';
import chatroom from './chatroom/main';
import menu from './menu/main';
import { SwipeState } from '../../client-server-common/common';
​
export interface MenuReduxState {
    swipeStateFilter: SwipeState;
    filterNavWidth: number;
    isSwipeInPopular: boolean;
}

export interface ChatroomReduxState {
    swipeStateChatroom: SwipeState;
    leftNavWidth: number;
    rightNavWidth: number;
}

export default combineReducers({
    chatroom,
    menu
});