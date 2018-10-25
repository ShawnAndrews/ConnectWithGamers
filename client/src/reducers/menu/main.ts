import { ReduxActions, SwipeActionType } from '../../actions/main';
import { MenuReduxState } from '../main';​
import { SwipeState } from '../../../client-server-common/common';

const initialState: MenuReduxState = {
    swipeStateFilter: SwipeState.Middle,
    filterNavWidth: 200,
    isSwipeInPopular: false
};

const MenuNavigation = (state: MenuReduxState = initialState, action: any) => {

    switch (action.type) {

        case ReduxActions.SWIPE_LEFT_FILTER: {
            const actionResult: SwipeActionType = action;
            const newState: MenuReduxState = state;

            if (state.swipeStateFilter === SwipeState.Middle) {
                newState.swipeStateFilter = SwipeState.Right;
            }
            
            return Object.assign({}, state, newState);
        }

        case ReduxActions.SWIPE_RIGHT_FILTER: {
            const actionResult: SwipeActionType = action;
            const newState: MenuReduxState = state;

            if (state.swipeStateFilter === SwipeState.Right) {
                newState.swipeStateFilter = SwipeState.Middle;
            }

            return Object.assign({}, state, newState);
        }

        case ReduxActions.SET_MOUSE_IN_POPULAR_FILTER: {
            const actionResult: SwipeActionType = action;
            const newState: MenuReduxState = state;

            if (!state.isSwipeInPopular) {
                newState.isSwipeInPopular = true;
                console.log(`true!`);
            }

            return Object.assign({}, state, newState);
        }

        case ReduxActions.SET_MOUSE_NOT_IN_POPULAR_FILTER: {
            const actionResult: SwipeActionType = action;
            const newState: MenuReduxState = state;

            if (state.isSwipeInPopular) {
                newState.isSwipeInPopular = false;
                console.log(`false!`);
            }

            return Object.assign({}, state, newState);
        }
        
        default:
            return state;
    }
};
​
export default MenuNavigation;