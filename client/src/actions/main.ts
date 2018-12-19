export const enum ReduxActions {
    TOGGLE_SEARCH_MODAL,
}

export interface SwipeActionType {
    type: ReduxActions;
}

export function toggleSearchModal(): SwipeActionType {
    return { type: ReduxActions.TOGGLE_SEARCH_MODAL };
}