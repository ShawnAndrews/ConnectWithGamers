import { ReduxActions, SwipeActionType } from '../../actions/main';
import { ChatroomReduxState } from '../main';​
import { SwipeState } from '../../../client-server-common/common';

const initialState: ChatroomReduxState = {
    swipeStateChatroom: SwipeState.Middle,
    leftNavWidth: 50,
    rightNavWidth: 200
};

const ChatroomNavigation = (state: ChatroomReduxState = initialState, action: any) => {

    switch (action.type) {

        case ReduxActions.SWIPE_LEFT_CHATROOM: {
            const actionResult: SwipeActionType = action;
            const newState: ChatroomReduxState = state;

            if (state.swipeStateChatroom === SwipeState.Left) {
                newState.swipeStateChatroom = SwipeState.Middle;
            } else if (state.swipeStateChatroom === SwipeState.Middle) {
                newState.swipeStateChatroom = SwipeState.Right;
            }
            return Object.assign({}, state, newState);
        }

        case ReduxActions.SWIPE_RIGHT_CHATROOM: {
            const actionResult: SwipeActionType = action;
            const newState: ChatroomReduxState = state;

            if (state.swipeStateChatroom === SwipeState.Right) {
                newState.swipeStateChatroom = SwipeState.Middle;
            } else if (state.swipeStateChatroom === SwipeState.Middle) {
                newState.swipeStateChatroom = SwipeState.Left;
            }

            return Object.assign({}, state, newState);
        }
        
        default:
            return state;
    }
};
​
export default ChatroomNavigation;