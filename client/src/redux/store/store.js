import { createStore, combineReducers  } from 'redux'
import dashboardReducer from "../reducers/dashboardReducer";
import loginReducer from "../reducers/loginReducer";

const store = createStore(combineReducers({dashboardReducer, loginReducer}));

export default store;