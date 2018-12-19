import { ReduxActions, SwipeActionType } from '../../actions/main';
import { SearchReduxState } from '../main';

const initialState: SearchReduxState = {
    toggleSearch: false
};

const SearchReducer = (state: SearchReduxState = initialState, action: any) => {

    switch (action.type) {

        case ReduxActions.TOGGLE_SEARCH_MODAL: {
            const actionResult: SwipeActionType = action;
            const newState: SearchReduxState = state;

            newState.toggleSearch = !state.toggleSearch;
            
            return Object.assign({}, state, newState);
        }
        
        default:
            return state;
    }
};
​
export default SearchReducer;