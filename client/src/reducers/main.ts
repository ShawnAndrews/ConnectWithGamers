import { combineReducers } from 'redux';
import search from './search/main';

export interface SearchReduxState {
    toggleSearch: boolean;
}

export default combineReducers({
    search
});