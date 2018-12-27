export const enum ReduxActionEnum {
    TOGGLE_SEARCH_MODAL,
    SET_LOGGED_IN
}

export interface ReduxAction {
    type: ReduxActionEnum;
    data?: any;
}

export function toggleSearchModal(): ReduxAction {
    return { type: ReduxActionEnum.TOGGLE_SEARCH_MODAL };
}

export function setLoggedIn(loggedIn: boolean): ReduxAction {
    return { type: ReduxActionEnum.SET_LOGGED_IN, data: loggedIn };
}