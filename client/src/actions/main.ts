export const enum ReduxActions {
    SWIPE_LEFT_FILTER,
    SWIPE_RIGHT_FILTER,
    SET_MOUSE_IN_POPULAR_FILTER,
    SET_MOUSE_NOT_IN_POPULAR_FILTER,
    SWIPE_LEFT_CHATROOM,
    SWIPE_RIGHT_CHATROOM,
}

export interface SwipeActionType {
    type: ReduxActions;
}

export function swipeLeftChatroom(): SwipeActionType {
    return { type: ReduxActions.SWIPE_LEFT_CHATROOM };
}

export function swipeRightChatroom(): SwipeActionType {
    return { type: ReduxActions.SWIPE_RIGHT_CHATROOM };
}

export function swipeLeftFilter(): SwipeActionType {
    return { type: ReduxActions.SWIPE_LEFT_FILTER };
}

export function swipeRightFilter(): SwipeActionType {
    return { type: ReduxActions.SWIPE_RIGHT_FILTER };
}

export function setMouseInPopularFilter(): SwipeActionType {
    return { type: ReduxActions.SET_MOUSE_IN_POPULAR_FILTER };
}

export function setMouseNotInPopularFilter(): SwipeActionType {
    return { type: ReduxActions.SET_MOUSE_NOT_IN_POPULAR_FILTER };
}