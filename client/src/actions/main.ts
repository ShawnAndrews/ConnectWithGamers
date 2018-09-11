export const enum ChatroomActions {
    SWIPE_LEFT,
    SWIPE_RIGHT
}

export interface SwipeActionType {
    type: ChatroomActions;
}

export function swipeLeft(): SwipeActionType {
    return { type: ChatroomActions.SWIPE_LEFT };
}

export function swipeRight(): SwipeActionType {
    return { type: ChatroomActions.SWIPE_RIGHT };
}