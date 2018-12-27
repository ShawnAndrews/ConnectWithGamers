import { combineReducers } from 'redux';
import search, { SearchReduxState } from './search/main';
import topnav, { TopnavReduxState } from './topnav/main';

export interface GlobalReduxState {
    search?: SearchReduxState,
    topnav?: TopnavReduxState
}

export default combineReducers({
    search,
    topnav
});