import { ChatroomActions, SwipeActionType } from '../../actions/main';
import { ChatroomReduxState } from '../main';​
import { SwipeState } from '../../chat/ChatroomMenuContainer';

const initialState: ChatroomReduxState = {
    swipeState: SwipeState.Middle,
    leftNavWidth: 50,
    rightNavWidth: 200
};

const ChatroomNavigation = (state: ChatroomReduxState = initialState, action: any) => {

    switch (action.type) {

        case ChatroomActions.SWIPE_LEFT: {
            const actionResult: SwipeActionType = action;
            const newState: ChatroomReduxState = state;

            if (state.swipeState === SwipeState.Left) {
                newState.swipeState = SwipeState.Middle;
            } else if (state.swipeState === SwipeState.Middle) {
                newState.swipeState = SwipeState.Right;
            }
            return Object.assign({}, state, newState);
        }

        case ChatroomActions.SWIPE_RIGHT: {
            const actionResult: SwipeActionType = action;
            const newState: ChatroomReduxState = state;

            if (state.swipeState === SwipeState.Right) {
                newState.swipeState = SwipeState.Middle;
            } else if (state.swipeState === SwipeState.Middle) {
                newState.swipeState = SwipeState.Left;
            }

            return Object.assign({}, state, newState);
        }
        
        default:
            return state;
    }
};
​
export default ChatroomNavigation;