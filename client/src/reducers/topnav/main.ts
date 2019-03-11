import { ReduxActionEnum, ReduxAction } from '../../actions/main';
import { loggedIn } from '../../service/account/main';
import { CurrencyType } from '../../../client-server-common/common';
import { getCurrencyByCookie, setCurrencyCookie } from '../../util/main';

export interface TopnavReduxState {
    loggedIn: boolean;
    currencyType: CurrencyType;
    currencyRate: number;
}

const initialState: TopnavReduxState = {
    loggedIn: loggedIn(),
    currencyType: getCurrencyByCookie(),
    currencyRate: undefined
};

const TopnavReducer = (state: TopnavReduxState = initialState, action: any) => {

    switch (action.type) {

        case ReduxActionEnum.SET_LOGGED_IN: {
            const actionResult: ReduxAction = action;
            const newState: TopnavReduxState = state;

            const loggedIn: boolean = actionResult.data;

            newState.loggedIn = loggedIn;
            
            return Object.assign({}, state, newState);
        }

        case ReduxActionEnum.CHANGE_CURRENCY: {
            const actionResult: ReduxAction = action;
            const newState: TopnavReduxState = state;

            const newCurrencyType: CurrencyType = actionResult.data.currencyType;
            const newCurrencyRate: number = actionResult.data.currencyRate;

            newState.currencyType = newCurrencyType;
            newState.currencyRate = newCurrencyRate;

            setCurrencyCookie(newCurrencyType);

            return Object.assign({}, state, newState);
        }
        
        default:
            return state;
    }
};
​
export default TopnavReducer;