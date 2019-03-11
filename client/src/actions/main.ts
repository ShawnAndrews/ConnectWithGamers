import { CurrencyType } from "../../client-server-common/common";

export const enum ReduxActionEnum {
    SET_LOGGED_IN,
    CHANGE_CURRENCY
}

export interface ReduxAction {
    type: ReduxActionEnum;
    data?: any;
}

export function setLoggedIn(loggedIn: boolean): ReduxAction {
    return { type: ReduxActionEnum.SET_LOGGED_IN, data: loggedIn };
}

export function changeCurrency(newCurrencyType: CurrencyType, newCurrencyRate: number): ReduxAction {
    return { type: ReduxActionEnum.CHANGE_CURRENCY, data: {currencyType: newCurrencyType, currencyRate: newCurrencyRate} };
}