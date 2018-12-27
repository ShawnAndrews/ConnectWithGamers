import { ReduxActionEnum, ReduxAction } from '../../actions/main';

export interface SearchReduxState {
    toggleSearch: boolean;
}

const initialState: SearchReduxState = {
    toggleSearch: false
};

const SearchReducer = (state: SearchReduxState = initialState, action: any) => {

    switch (action.type) {

        case ReduxActionEnum.TOGGLE_SEARCH_MODAL: {
            const actionResult: ReduxAction = action;
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