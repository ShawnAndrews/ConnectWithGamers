import { ReduxActionEnum, ReduxAction } from '../../actions/main';
import { loggedIn } from '../../service/account/main';

export interface TopnavReduxState {
    loggedIn: boolean;
}

const initialState: TopnavReduxState = {
    loggedIn: loggedIn()
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
        
        default:
            return state;
    }
};
​
export default TopnavReducer;