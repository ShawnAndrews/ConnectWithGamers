export const enum ReduxActionEnum {
    SET_LOGGED_IN
}

export interface ReduxAction {
    type: ReduxActionEnum;
    data?: any;
}

export function setLoggedIn(loggedIn: boolean): ReduxAction {
    return { type: ReduxActionEnum.SET_LOGGED_IN, data: loggedIn };
}