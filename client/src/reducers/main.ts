import { combineReducers } from 'redux';
import topnav, { TopnavReduxState } from './topnav/main';

export interface GlobalReduxState {
    topnav?: TopnavReduxState
}

export default combineReducers({
    topnav
});